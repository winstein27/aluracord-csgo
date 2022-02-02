import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';
import { createClient } from "@supabase/supabase-js";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker"
import Header from "../src/components/Header.js";
import MessagesList from '../src/components/MessagesList.js';

const SUPABASE_URL = "https://ujhykihdloyxkunafdhv.supabase.co";
const SUPABASE_ANON_PUBLIC = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzUwMDQyNCwiZXhwIjoxOTU5MDc2NDI0fQ.zeQ853Ag0_2oFq7SQqI8HZvY_-WZyfkhsSY4ohBm3FI";
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_PUBLIC);

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const router = useRouter();

    useEffect(() => {
        supabaseClient
            .from("message")
            .select("*")
            .order("id", { ascending: false })
            .then(({ data }) => {
                setMessages(data);
            });

        const subscription = listenToRealTimeMessages(newMessage => {
            setMessages(messagesList => [newMessage, ...messagesList]);
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    function listenToRealTimeMessages(loadMessages) {
        return supabaseClient
            .from("message")
            .on("INSERT", live => {
                loadMessages(live.new);
            })
            .subscribe();
    }

    function handleMessageKeyPress(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            addMessage();
        }
    }

    const addMessage = () => {
        const newMessage = {
            from: router.query.username,
            text: message
        };

        addMessageToDatabase(newMessage);
        
        setMessage("");
    }

    function handleStickerClick(sticker) {
        const newMessage = {
            from: router.query.username,
            text: `:sticker: ${sticker}`
        }

        addMessageToDatabase(newMessage);
    }

    function addMessageToDatabase(newMessage) {
        supabaseClient
        .from("message")
        .insert([newMessage])
        .then(() => null);
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: 'url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/counter-strike-global-offensive-dust-ii.jpg)',
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header router={router} />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessagesList messages={messages} setMessages={setMessages} supabase={supabaseClient} loggedUser={router.query.username} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={message}
                            onChange={event => {
                                setMessage(event.target.value);
                            }}
                            onKeyPress={event => handleMessageKeyPress(event)}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            label='Enviar'
                            onClick={addMessage}
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />
                        <ButtonSendSticker onStickerClick={(sticker) => {
                            handleStickerClick(sticker);
                        }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
