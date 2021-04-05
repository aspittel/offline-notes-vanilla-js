import { Amplify, DataStore } from 'aws-amplify'
import awsconfig from './aws-exports'

import { Note } from './models'

Amplify.configure(awsconfig)

let draft = {}

async function createNewDraft () {
  try {
    draft = await DataStore.save(
      new Note({
        title: '',
        body: '',
        draft: true
      })
    )
  } catch (err) {
    console.error(err)
  }
}

document.querySelector('.create-form').addEventListener('submit', async e => {
  try {
    e.preventDefault()
    const title = document.querySelector('#title').value
    const body = document.querySelector('#body').value

    const newNote = await DataStore.save(Note.copyOf(draft, updatedNote => {
      updatedNote.title = title
      updatedNote.body = body
      updatedNote.draft = false
    }))
    console.log(newNote)

    createNewDraft()

    document.querySelector('#title').value = draft.title
    document.querySelector('#body').value = draft.body
  } catch (err) {
    console.error(err)
  }
})


window.addEventListener('load', async () => {
  const drafts = await DataStore.query(Note, note => note.draft('eq', true))
    if (drafts.length === 0) {
      try {
        createNewDraft()
      } catch (err) {
        console.error(err)
      }
    } else if (drafts.length === 1) {
      draft = drafts[0]
      document.querySelector('#title').value = draft.title
      document.querySelector('#body').value = draft.body
    } else {
      alert('weird! you have multiple drafts!')
    }       
})

window.addEventListener('beforeunload', async () => {
  try {
    const title = document.querySelector('#title').value
    const body = document.querySelector('#body').value
    
    await DataStore.save(Note.copyOf(draft, updatedNote => {
      updatedNote.title = title
      updatedNote.body = body
    }))

  } catch (err) {
    console.error(err)
  }
})