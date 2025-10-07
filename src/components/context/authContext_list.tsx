import React, { createContext, useContext, useRef, useEffect, useState } from "react";
import {
    Alert,
    Dimensions, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity,
    View
} from "react-native";
import { MaterialIcons, AntDesign } from '@expo/vector-icons';
import { Modalize } from "react-native-modalize";
import { Input } from "../../components/input";
import { themas } from "../../global/themes";
import { Flag } from "../../components/Flag";
import CustomDateTimePicker from "../../components/CustomDateTimePicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContextList: any = createContext({});

const flags = [
    { caption: 'Urgente', color: themas.colors.red },
    { caption: 'Opcional', color: themas.colors.blueLight }
];


export const AuthProviderList = (props: any): any => {

    const modalizeRef = useRef<Modalize>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFlag, setSelectedFlag] = useState('Urgente');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [item, setItem] = useState(0);
    const [taskList, setTaskList] = useState([]);


    const onOpen = () => {
        modalizeRef?.current?.open();

    }
    const onClose = () => {
        modalizeRef?.current?.close();
    }

    useEffect(() => {
        get_taskList()
    }, []);

    const _renderFlags = () => {
        return (
            flags.map((item, index) => (
                <TouchableOpacity key={index}
                    onPress={() => {
                        setSelectedFlag(item.caption)
                    }}
                >
                    <Flag
                        caption={item.caption}
                        color={item.color}
                        selected={item.caption == selectedFlag}
                    />
                </TouchableOpacity>
            ))
        )
    }
    const handleDateChange = (date) => {
        setSelectedDate(date);
    }
    const handleTimeChange = (date) => {
        setSelectedTime(date);
    }

    const handleSave = async () => {
        if (!title || !description || !selectedFlag) {
            return Alert.alert('Atenção', 'Preencha os campos corretamente!');
        }
        try {
            const newItem = {
                item: item !== 0 ? item : Date.now(),
                title,
                description,
                flag: selectedFlag,
                timeLimit: new Date(
                    selectedDate.getFullYear(),
                    selectedDate.getMonth(),
                    selectedDate.getDate(),
                    selectedTime.getHours(),
                    selectedTime.getMinutes()
                ).toISOString(),
            }
            const storageData = await AsyncStorage.getItem('taskList');
            //console.log(storageData)
            let taskList: Array<any> = storageData ? JSON.parse(storageData) : [];

            const itemIndex = taskList.findIndex((task) => task.item === newItem.item)

            if (itemIndex >= 0) {
                taskList[itemIndex] = newItem
            } else {
                taskList.push(newItem)
            }

            await AsyncStorage.setItem('taskList', JSON.stringify(taskList))

            setTaskList(taskList)
            setData()
            onClose()

        } catch (error) {
            console.log("Erro ao salvar o item", error)
        }

    }
    const setData = () => {
        setTitle('')
        setDescription(''),
            setSelectedFlag('Urgente'),
            setItem(0)
        setSelectedDate(new Date())
        setSelectedTime(new Date())
    }

    async function get_taskList() {
        try {
            const storageData = await AsyncStorage.getItem('taskList');
            const taskList = storageData ? JSON.parse(storageData) : []
            setTaskList(taskList)

        } catch (error) {
            console.log(error)
        }

    }

    const handleDelete = async (itemToDelete) => {
        try {
            const StorageData = await AsyncStorage.getItem('taskList')
            const taskList: Array<any> = StorageData ? JSON.parse(StorageData) : []

            const updatedTaskList = taskList.filter(item => item.item !== itemToDelete.item)

            await AsyncStorage.setItem('taskList', JSON.stringify(updatedTaskList))
            setTaskList(updatedTaskList)

        } catch (error) {
            console.log("Erro ao excluir o item", error)
        }
    }

    const handleEdit = async (itemToEdit: PropCard) => {
        try {
            setTitle(itemToEdit.title)
            setDescription(itemToEdit.description)
            setItem(itemToEdit.item)
            setSelectedFlag(itemToEdit.flag)

            const timeLimit = new Date(itemToEdit.timeLimit);
            setSelectedDate(timeLimit)
            setSelectedTime(timeLimit)

            onOpen()

        } catch (error) {
            console.log('Erro ao editar')
        }
    }

    const _container = () => {
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => onClose()}>
                        <MaterialIcons
                            name="close"
                            size={30}
                        />
                    </TouchableOpacity>

                    <Text style={styles.title}>Criar Tarefa</Text>

                    <TouchableOpacity onPress={() => handleSave()}>
                        <AntDesign
                            name="check"
                            size={30}
                        />
                    </TouchableOpacity>

                </View>
                <View style={styles.content}>
                    <Input
                        title="Titulo"
                        labelStyle={styles.label}
                        value={title}
                        onChangeText={setTitle}
                    />
                    <Input
                        title="Descrição"
                        labelStyle={styles.label}
                        height={100}
                        multiline
                        numberOfLines={5}
                        value={description}
                        onChangeText={setDescription}
                        textAlignVertical="top"
                    />
                </View>
                <View style={{ width: '40%' }}>
                    {/* <Input
                        title="Tempo limite:"
                        labelStyle={styles.label}
                    /> */}
                    <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ width: 200 }}>
                            <Input
                                title="Data Limite"
                                labelStyle={styles.label}
                                editable={false}
                                value={selectedDate.toLocaleDateString()}
                                onPress={() => setShowDatePicker(true)}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ width: 120 }} onPress={() => setShowTimePicker(true)}>
                            <Input
                                title="Hora Limite"
                                labelStyle={styles.label}
                                editable={false}
                                value={selectedTime.toLocaleTimeString()}
                                onPress={() => setShowTimePicker(true)}
                            />
                        </TouchableOpacity>
                    </View>
                    <CustomDateTimePicker
                        onDateChange={handleDateChange}
                        setShow={setShowDatePicker}
                        show={showDatePicker}
                        type={'date'}
                    />
                    <CustomDateTimePicker
                        onDateChange={handleTimeChange}
                        setShow={setShowTimePicker}
                        show={showTimePicker}
                        type={'time'}
                    />
                </View>
                <View style={styles.containerFlag}>
                    <Text style={styles.label}>Flags:</Text>
                    <View style={styles.rowFlags}>
                        {_renderFlags()}
                    </View>
                </View>
            </KeyboardAvoidingView>
        )
    }
    return (
        <AuthContextList.Provider value={{ onOpen, taskList, handleDelete, handleEdit }}>
            {props.children}
            <Modalize
                ref={modalizeRef}
                // modalHeight={Dimensions.get('window').height / 1.3}
                childrenStyle={{ height: Dimensions.get('window').height / 1.3 }}
                adjustToContentHeight={true}
            >
                {_container()}
            </Modalize>
        </AuthContextList.Provider>
    )
}

export const useAuth = () => useContext(AuthContextList);
export const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    header: {
        width: '100%',
        height: 40,
        paddingHorizontal: 40,
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    content: {
        width: '100%',
        paddingHorizontal: 20
    },
    containerFlag: {
        width: '100%',
        padding: 10
    },
    label: {
        fontWeight: 'bold',
        color: '#000'
    },
    rowFlags: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10
    }
})