import { Injectable, signal } from '@angular/core';

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  birthDate: Date | string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private contactsSignal = signal<Contact[]>([]);

  get contacts() {
    return this.contactsSignal.asReadonly();
  }

  addContact(contact: Omit<Contact, 'id'>) {
    const newContact = { ...contact, id: crypto.randomUUID() };
    this.contactsSignal.update(contacts => [...contacts, newContact]);
  }

  updateContact(updatedContact: Contact) {
    this.contactsSignal.update(contacts =>
      contacts.map(c => c.id === updatedContact.id ? updatedContact : c)
    );
  }

  deleteContact(id: string) {
    this.contactsSignal.update(contacts => contacts.filter(c => c.id !== id));
  }
}