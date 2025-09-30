import React, { useState } from "react";

import {
    Text, View, Image, TextInput, TouchableOpacity,
    Alert, ActivityIndicator
} from "react-native";
import { style } from "./styles";
import Logo from "../../assets/logo.png";
import { MaterialIcons, Octicons } from '@expo/vector-icons'
import { themas } from "../../global/themes"
import { Input } from "../../components/input";
import { Button } from "../../components/Button";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import BottomRoutes from "../routes/bottom.routes";

export default function Login() {

    const navigation = useNavigation<NavigationProp<any>>();

    const [email, setEmail] = useState('a');
    const [password, setPassword] = useState('a');
    const [showPassword, setShowPassword] = useState(true);
    const [loading, setLoading] = useState(false);

    async function getLogin() {
        try {
            setLoading(true)
            if (!email || !password) {
                return Alert.alert('Atenção', 'Informe os campos obrigatórios!');
            }

            navigation.reset({ routes: [{ name: "BottomRoutes" }] })

            console.log("Logou!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    return (
        < View style={style.container} >
            <View style={style.boxTop}>
                <Image
                    source={Logo}
                    style={style.logo}
                    resizeMode="contain"
                />
                <Text style={style.text}>Bem vindo de volta!</Text>
            </View>
            <View style={style.boxMid}>
                <Input
                    value={email}
                    onChangeText={setEmail}
                    title="ENDEREÇO E-MAIL"
                    IconRight={MaterialIcons}
                    IconRightName="email"
                />
                <Input
                    value={password}
                    onChangeText={setPassword}
                    title="SENHA"
                    IconRight={Octicons}
                    IconRightName={showPassword ? "eye-closed" : "eye"} // Logica do olho aberto ao ver a senha
                    secureTextEntry={showPassword}
                    onIconRightPress={() => setShowPassword(!showPassword)}
                />
            </View>
            <View style={style.boxBotton}>
                <Button text="Entrar" loading={loading} onPress={() => getLogin()} />
            </View>
            <Text style={style.textBotton}>Não tem conta?
                <Text style={{ color: themas.colors.primary }}> Crie agora!</Text></Text>
        </View >
    )
}