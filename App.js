import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import CustomDrawerContent from './components/CustomDrawer';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function HomeScreen({ navigation }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');

  const addTodo = () => {
    if (text.trim() !== '') {
      const newTodo = {
        id: Date.now().toString(),
        text: text.trim(),
      };
      setTodos([...todos, newTodo]);
      setText('');
    }
  };

  const deleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const updateTodo = (updatedTodo) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.todoItem}
      onLongPress={() => navigation.navigate('수정화면', { item, updateTodo })}
    >
      <Text style={styles.todoText}>{item.text}</Text>
      <TouchableOpacity onPress={() => deleteTodo(item.id)}>
        <MaterialIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(value) => setText(value)}
        value={text}
        placeholder="할 일을 입력해주세요"
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.addButton} onPress={addTodo}>
        <Text style={styles.addButtonText}>추가</Text>
      </TouchableOpacity>
      <FlatList
        data={todos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
    </View>
  );
}

function EditScreen({ route, navigation }) {
  const { item, updateTodo } = route.params;
  const [text, setText] = useState(item.text);

  const updateItem = () => {
    if (text.trim() !== '') {
      const updatedTodo = {
        id: item.id,
        text: text.trim(),
      };
      updateTodo(updatedTodo);
      Keyboard.dismiss();
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={(value) => setText(value)}
        value={text}
        placeholder="Edit todo..."
        placeholderTextColor="#aaa"
        onSubmitEditing={updateItem}
      />
      <TouchableOpacity style={styles.updateButton} onPress={updateItem}>
        <Text style={styles.updateButtonText}>수정하기</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerPosition="right"
        drawerStyle={{
          backgroundColor: 'skyblue',
          width: 200
        }}
        drawerContentOptions={{
          activeTintColor: 'blue',
          activeBackgroundColor: 'lightblue'
        }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      >
        <Drawer.Screen name="Home" component={HomeStack} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="To Do List (2018243048 심재운)">
      <Stack.Screen name="To Do List (2018243048 심재운)" component={HomeScreen} />
      <Stack.Screen name="수정화면" component={EditScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  addButton: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  todoText: {
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});