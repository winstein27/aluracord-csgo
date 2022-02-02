import React from "react";
import appConfig from '../../config.json';
import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';

export default function MessagesList(props) {
    function handleDeleteClick(messageId) {
        props.supabase
            .from("message")
            .delete()
            .match({ id: messageId })
            .then(() => {
                props.setMessages(props.messages.filter(message => message.id !== messageId));
            });
    }

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.messages.map(message => {
                return (
                    <Text
                        key={message.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        {(props.loggedUser === message.from) &&
                            <Icon
                                onClick={() => handleDeleteClick(message.id)}
                                name="FaRegTrashAlt"
                                styleSheet={{
                                    display: 'inline-block',
                                    width: '20px',
                                    height: '20px',
                                }}
                            />
                        }
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >

                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${message.from}.png`}
                            />
                            <Text tag="strong">
                                {message.from}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {message.text.startsWith(":sticker:")
                            ? <Image
                                src={message.text.replace(":sticker: ", "")}
                                styleSheet={{
                                    width: '150px',
                                    height: '150px'
                                }}
                            />
                            : message.text
                        }
                    </Text>
                )
            })}
        </Box>
    )
}