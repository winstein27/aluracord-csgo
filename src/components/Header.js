import React from "react";
import { Box, Text, TextField, Image, Button, Icon } from '@skynexui/components';

export default function Header(props) {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    onClick={() => props.router.push("/")}
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                />
            </Box>
        </>
    )
}