import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native"
import styles from "./style";
import React, { useState, useEffect, useCallback } from "react";
import { Picker } from "@react-native-picker/picker";
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { BotoesDetalhes } from "../Botao";
import { useContextoEquipmente } from "../../hooks";
import LottieView from 'lottie-react-native';
import { useFocusEffect } from "@react-navigation/native";

Icon.loadFont();

export default function Detalhe({ route, navigation }: any) {
    
    const { equipmente, setLoaded, loaded, getEquipment } = useContextoEquipmente();
   // const [ novoEquipamento, setNovoEquipamento ] = useState<any>()
    
    // Encontre o equipamento com base no itemId

    // Defina estados iniciais com base no equipamento selecionado
    const [selectedEquipa, setSelectedEquipa] = useState<string>();
    const [image, setImage] = useState<any>();
    const [numero, setNumero] = useState<string>();
    const [imei, setImei] = useState<string>();
    const [latitude, setLatitude] = useState<string>();
    const [longitude, setLongitude] = useState<string>();
    const [observacoes, setObservacoes] = useState<string>();

    // Use o useEffect para atualizar os estados quando um novo equipamento for selecionado
   useFocusEffect(useCallback(() => {
        try{
            const {itemId} = route.params
            //const novoEquipamento = equipmente.find(equip => equip._id === itemId);
            async function init() {
                //setNovoEquipamento(await getEquipment(itemId))
                const novoEquipamento = await getEquipment(itemId)
                if (novoEquipamento) {
                    setSelectedEquipa(novoEquipamento?.type || '');
                    setImage(novoEquipamento?.url[0] || null);
                    setNumero(novoEquipamento?.numero.toString() || '');
                    setImei(novoEquipamento?.serial || '');
                    setLatitude(novoEquipamento?.latitude.toString() || '');
                    setLongitude(novoEquipamento?.longitude.toString() || '');
                    setObservacoes(novoEquipamento?.observations || '');
                }
            }
            init()
            console.log(itemId);
          
            
            
        }catch(err){
            console.log("Assim não");
            //navigation.navigate('Cadastro')
        }
        
        
    }, [equipmente, route.params]))

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status === 'granted') {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } else {
            Alert.alert("Permissão negada", "Você precisa permitir o acesso à galeria de imagens para adicionar uma imagem.");
        }
    };

    const removeImage = () => {
        setImage(null);
    };

    const handleEquipamentoChange = (equipamento: string) => {
        setSelectedEquipa(equipamento);
    };

    return (
        <View style={styles.containerPrincipal}>
            {loaded && (
          <View style={styles.uploadingAnimation}>
          <LottieView
              autoPlay={true}
              loop={true}
              style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'white',
              }}
              source={require('../../assets/carregando.json')}
          />
          </View>
        )}
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.containerImagem} >
                        {image && <Image source={{ uri: image }} style={styles.image} />}
                        {/* <Image source={require('../../assets/iconImage.png')} style={styles.image}  /> */}
                    </View>

                    <View style={styles.containerIcons}>
                        <TouchableOpacity style={styles.iconsPlusMinus} onPress={pickImage}>
                            <Icon name="plus" size={25} color="#000000" />
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={styles.iconsPlusMinus} onPress={pickImage}>
                            <Icon name="camera" size={25} color="#000000" />
                        </TouchableOpacity> */}
                        <TouchableOpacity style={styles.iconsPlusMinus} onPress={removeImage}>
                            <Icon name="trash" size={25} color="#000000" />
                        </TouchableOpacity>
                    </View>

                </View>

                <View style={styles.containerInput}>
                    <View style={styles.containerTrans}>
                        <Picker
                            selectedValue={selectedEquipa}
                            onValueChange={handleEquipamentoChange}
                            style={styles.picker}
                        >
                            <Picker.Item label="Equipamento" value="" enabled={false} />
                            <Picker.Item label="Transformador" value="Transformador" />
                            <Picker.Item label="Poste" value="Poste" />
                            <Picker.Item label="Bomba hidráulica" value="Bomba hidráulica" />
                        </Picker>
                        <TextInput placeholder="Número" keyboardType="numeric" style={styles.input} defaultValue={numero} />
                    </View>

                    <TextInput placeholder="IMEI" style={styles.inputInteiro} defaultValue={imei} />

                    <View style={styles.containerLoLa}>
                        <Text style={styles.textFont}>Latitude:</Text>
                        <TextInput keyboardType="numeric" placeholder="Latitude" style={styles.inputLoLa} defaultValue={latitude} />

                        <Text style={styles.textFont}>Longitude:</Text>
                        <TextInput keyboardType="numeric" placeholder="Longitude" style={styles.inputLoLa} defaultValue={longitude} />
                    </View>

                    <TextInput placeholder="Observações" style={styles.inputInteiro} defaultValue={observacoes} />
                </View>

                <View style={styles.containerBotao}>
                    <BotoesDetalhes
                        text="Ativar"
                        style={styles.botaoAtivar}
                        label="Ativar Equipamento"
                        message="ativado"
                    />
                    <BotoesDetalhes
                        text="Desativar"
                        style={styles.botaoDesativar}
                        label="Desativar Equipamento"
                        message="desativado"
                    />
                </View>
            </ScrollView>
        </View>
    );
}