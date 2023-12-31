import React, { useState,useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity ,Button} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';



//funzione per rendere persistenti i dati
const storeData = async (value) => {
  try {
   
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('my-key', jsonValue);
  } catch (e) {
    console.log(e);
  }
};

function Item({ item, onDeleteItem }) {
  const handleDelete = () => {
    onDeleteItem(item);
  };

  return (
    <View style={styles.listItem}>
      <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: item.coloreEsadecimale }} />
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontWeight: "bold", top:20 }}>{item.numeroAssociato}</Text>
      </View>
      <TouchableOpacity style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }} onPress={handleDelete}>
        <FontAwesome name="trash" size={24} color="green" />
      </TouchableOpacity>
    </View>
  );
}

export default function Lista({navigation,route}) {
  const [nextId, setNextId] = useState(0); 

  const [data, setData] = useState([ ]);

  //funzione per eliminare un elemento della lista
  const deleteItem = (itemToDelete) => {
    const updatedData = data.filter((item) => item !== itemToDelete);
    setData(updatedData);
    
  };

   // Funzione per aggiungere un nuovo elemento alla lista
   const addItemToList = (newItem) => {
    const newItemWithId = {
      ...newItem,
      id: nextId.toString(), // Converte l'ID in una stringa
      
    };
    
    setData([...data, newItemWithId]);
    
    setNextId(nextId + 1); // Incrementa l'ID successivo
   
  };

  //serve a rendere persistenti i dati
  useEffect(() => {
    storeData(data);
  },[data]);//esegue solo quando cambiano i dati
  
  useEffect(() => {
    const prova = route.params;
    if (prova) {
      addItemToList(prova);
    }
  }, [route.params]); // Esegui l'aggiunta solo quando cambiano i parametri

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        renderItem={({ item }) => <Item item={item} onDeleteItem={deleteItem} />}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.navigationButtonContainer}>
        <Button title="Inserisci" onPress={() => navigation.navigate('Home')} color="#34eb9b" />
        <Button title="Scansiona" onPress={() => navigation.navigate('Home2')} color="#34eb9b" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  navigationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  listItem: {
    backgroundColor: '#FFF',
    width: '90%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },
});
