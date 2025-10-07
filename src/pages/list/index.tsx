import React from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { style } from "././style";
import { Input } from "../../components/input";
import { MaterialIcons } from '@expo/vector-icons';
import { Ball } from "../../components/Ball";
import { Flag } from "../../components/Flag";
import { themas } from "../../global/themes";


export default function List() {

    const { taskList, handleDelete, handleEdit } = useContext<AuthContextType>(AuthContextList)
    const swipeableRefs = useRef([])

    const renderRightActions = () => (
        <View style={style.button}>
            <AntDesign
                name="delete"
                size={20}
                color={'#FFF'}
            />
        </View>
    );

    const handleSwipeOpen = (directions: 'right' | 'left', item, index) => {
        if (directions == 'right') {
            handleDelete(item)
        } else {
            handleEdit(item)
        }
        swipeableRefs.current[index]?.close()
    }

    const renderLeftActions = () => {
        return (
            <View style={[style.button, { backgroundColor: themas.colors.blueLight }]}>
                <AntDesign
                    name="edit"
                    size={20}
                    color={'#FFF'}
                />
            </View>
        )
    }

    const _renderCard = (item: PropCard, index) => {
        const color = item.flag == 'Opcional' ? themas.colors.blueLight : themas.colors.red
        return (
            <Swipeable
                ref={(ref) => swipeableRefs.current[index] = ref}
                key={index}
                renderRightActions={renderRightActions}
                renderLeftActions={renderLeftActions}
                onSwipeableOpen={(directions) => handleSwipeOpen(directions, item, index)}
            >
                <View style={style.card}>
                    <View style={style.rowCard}>
                        <View style={style.rowCardLeft}>
                            <Ball color={color} />
                            <View>
                                <Text style={style.titleCard}>{item.title}</Text>
                                <Text style={style.descriptionCard}>{item.description}</Text>
                                <Text style={style.descriptionCard}>Até {formatDateToBR(item.timeLimit)}</Text>
                            </View>
                        </View>
                        <Flag
                            caption={item.flag}
                            color={color} />
                    </View>
                </View>
            </Swipeable>
        )
    }
    return (
        <View style={style.container}>
            <View style={style.header}>
                <Text style={style.greeting}>Bom dia,
                    <Text style={{ fontWeight: 'bold' }}> Leonardo Pires</Text></Text>
                <View style={style.boxInput}>
                    <Input
                        IconLeft={MaterialIcons}
                        IconLeftName="search"
                    />
                </View>
            </View>
            <View style={style.boxList}>
                <FlatList
                    data={taskList}
                    style={{ marginTop: 40, paddingHorizontal: 30 }}
                    keyExtractor={(item, index) => item.item.toString()}
                    renderItem={({ item, index }) => { return (_renderCard(item, index)) }}
                />
            </View>
        </View>
    )
}