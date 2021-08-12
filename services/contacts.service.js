const fs = require('fs/promises');
const ErrorException = require('../exeptions/error.exception');

module.exports = class ContactsService {
	#contactsPath;

	constructor(contactsPath) {
		this.#contactsPath = contactsPath;
	}

	async #writeContacts(contacts) {
		try {
			await fs.writeFile(this.#contactsPath, JSON.stringify(contacts));
			return contacts;
		} catch (e) {
			ErrorException(e);
		}
	}

	async listContacts() {
		try {
			const contacts = await fs.readFile(this.#contactsPath);
			return JSON.parse(contacts.toString());
		} catch (e) {
			return [];
		}
	}

	async add(name, email, phone) {
		const contacts = await this.listContacts();
		const id = Math.max(...contacts.map(c => c.id), 0) + 1;
		contacts.push({ id, name, email,	phone });
		return await this.#writeContacts(contacts);
	}

	async get(id) {
		const contacts = await this.listContacts();
		const contact = contacts.find(contact => contact.id === Number(id));
		if (!contact) {
			ErrorException({message: `Contact with id (${id}) not found`});
		}
		return contact;
	}

	async remove(id) {
		const contacts = await this.listContacts();
		const filteredContacts = contacts.filter(contact => contact.id !== Number(id));
		try {
			if (contacts.length === filteredContacts.length) {
				ErrorException({message: `Contact with id (${id}) not found`});
			}
			return await this.#writeContacts(filteredContacts);
		} catch (e) {
			ErrorException(e);
		}
	}
}
