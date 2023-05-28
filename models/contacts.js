const fs = require('fs/promises')
const path = require('path');
const { nanoid } = require('nanoid');

const contactsPath = path.join(__dirname, "/contacts.json");

const listContacts = async () => {
  try {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
  
} catch (err) {
  console.log(err);
}
}

const getContactById = async (contactId) => {
  try {
    const data = await listContacts();
    const searchContacts = data.find(({id})=> id ===contactId)
    return searchContacts || null
} catch (error) {
    console.log(error)
}

}

const removeContact = async (contactId) => {
  try {
    const data = await listContacts();
    const index = data.findIndex(({ id }) => id === contactId);

    if (index === -1) {
      return null;
    }

    const [removedContact] = data.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));

    return removedContact;
} catch (error) {
    console.log(error)
}
}

const addContact = async (body) => {
  try {
  const data = await listContacts();
  const newContact = {
      id: nanoid(),
      ...body,
    };
    data.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
    return newContact;

} catch (error) {
  console.log(error)
}}

const updateContact = async (id, body) => {
  try {
    const data = await listContacts();
    const index = data.findIndex(( item ) => item.id === id);

    if (index === -1) {
      return null;
    }
  data[index] = {id, ...body};
  await fs.writeFile(contactsPath, JSON.stringify(data, null, 2));
  return  data[index];
  } catch (error) {
    console.log(error)
  } 
}

module.exports = { 
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
