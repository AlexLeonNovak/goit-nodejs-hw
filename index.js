const {Command} = require('commander');
const path = require('path');
const ContactService = require('./services/contacts.service');

const program = new Command();
const contactService = new ContactService(path.resolve(__dirname, './assets/contacts.json'));

program
	.option('-a, --action <type>', 'choose action')
	.option('-i, --id <type>', 'user id')
	.option('-n, --name <type>', 'user name')
	.option('-e, --email <type>', 'user email')
	.option('-p, --phone <type>', 'user phone')
;

program.parse(process.argv);
const argv = program.opts();


async function invokeAction({ action, id, name, email, phone }) {
	switch (action) {
		case 'list':
			const list = await contactService.listContacts();
			if (list.length) {
				console.table(list);
			} else {
				console.log('There are no contacts');
			}
			break;

		case 'get':
			const contact = await contactService.get(id);
			console.table(contact);
			break;

		case 'add':
			await contactService.add(name, email, phone);
			console.log('Contact added');
			break;

		case 'remove':
			await contactService.remove(id);
			console.log('Contact removed');
			break;

		default:
			console.warn('\x1B[31m Unknown action type!');
	}
}

invokeAction(argv);
