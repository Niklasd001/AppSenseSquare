import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity ,Button} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

function Item({ item, onDeleteItem }) {
  const handleDelete = () => {
    onDeleteItem(item);
  };

  return (
    <View style={styles.listItem}>
      <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: item.coloreEsadecimale }} />
      <View style={{ alignItems: "center", flex: 1 }}>
        <Text style={{ fontWeight: "bold" }}>{item.numeroAssociato}</Text>
      </View>
      <TouchableOpacity style={{ height: 50, width: 50, justifyContent: "center", alignItems: "center" }} onPress={handleDelete}>
        <FontAwesome name="trash" size={24} color="green" />
      </TouchableOpacity>
    </View>
  );
}

export default function App({ navigation }) {
  const [data, setData] = useState([
    {
      coloreEsadecimale: "#FF5733",
      numeroAssociato: "40",
      id: "1"
    },
    {
      coloreEsadecimale: "#FDB813",
      numeroAssociato: "41",
      id: "2"
    }
    // Altri elementi dati
  ]);

  const deleteItem = (itemToDelete) => {
    const updatedData = data.filter((item) => item !== itemToDelete);
    setData(updatedData);
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        renderItem={({ item }) => <Item item={item} onDeleteItem={deleteItem} />}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.navigationButtonContainer}>
        <Button title="Inserisci" onPress={() => navigation.navigate('Home')} color="black" />
        <Button title="Scansiona" onPress={() => navigation.navigate('Home')} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    marginTop: 60,
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
    width: '80%',
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: 5,
    marginVertical: 10,
    padding: 10,
  },
});
