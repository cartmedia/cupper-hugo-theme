import { useDynamic } from 'libs/hooks'
import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import {View, Text, TouchableOpacity, TextInput, Switch, Image} from 'react-native'
import { useStore } from 'Store'
import { tw } from 'Tailwind'
import { Button } from 'components/Button.component'
import { useNavigation } from '@react-navigation/native'
import { buildingAppsNative } from 'libs/BuildingAppsNative'

export const BooksContainer = observer(() => {
  // Do not spread the store, otherwise you lose reacttivity
  let root = useStore()
  let dynamic = useDynamic()
  let navigation = useNavigation()
  let [title, setTitle] = useState('')
  let [startAtLogin, setStartAtLogin] = useState(false)

  useEffect(() => {
    root.ui.fetchBooks()

    buildingAppsNative.getStartAtLoginStatus().then(setStartAtLogin)

  }, [])

  let addBook = () => {
    root.ui.addBook(title)
    setTitle('')
  }

  let backgroundColor = dynamic('bg-gray-900', 'bg-white')

  return (
    <View style={tw(`p-4 ${backgroundColor} flex-1`)}>
      {!!root.ui.imageUrl &&
        <Image source={{uri: root.ui.imageUrl}} style={tw('h-32 w-32')}/>
      }
      <View style={tw('flex-1')}>
        {root.ui.uppercasedBooks.map((book) => (
          <TouchableOpacity key={book.title} onPress={() => navigation.navigate('Book', {title: book})}>
            <View style={tw('p-2')}>
              <Text style={tw('font-bold')}>{book.title}</Text>
              <Text style={tw('text-gray-500')}>{book.date.toLocaleDateString()}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <View style={tw('flex-row mt-4')}>
        <TextInput style={tw('flex-1 bg-black rounded p-3 mr-3')} placeholder="Book title" onChangeText={setTitle}/>
        <Button title="Add book" onPress={addBook}/>
        <Button title="Quit" onPress={() => buildingAppsNative.closeApp()} style={tw('ml-4')}/>
        <Button title="Open Window" onPress={() => buildingAppsNative.openDesktopWindow()} style={tw('ml-4')}/>
        <Button title="Notification" onPress={() => buildingAppsNative.sendNotification('Hello', 'This is a notification', '')} style={tw('ml-4')}/>
      </View>
      <View style={tw('flex-row items-center')}>
          <Text style={tw('mr-4')}>Start at login</Text>
          <Switch value={startAtLogin} onValueChange={() => {
            buildingAppsNative.setStartAtLoginStatus(!startAtLogin)
            setStartAtLogin(!startAtLogin)
          }}/>
      </View>
    </View>
  )

})