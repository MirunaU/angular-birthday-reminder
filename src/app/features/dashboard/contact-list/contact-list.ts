import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, Contact } from '../../../core/services/contact';
import { AuthService } from '../../../core/services/auth';
import { Router } from '@angular/router';

import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ContactModal } from '../contact-modal/contact-modal';

@Component({
  selector: 'app-contact-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzPopconfirmModule,
    NzIconModule,
    ContactModal
  ],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.scss']
})
export class ContactListComponent {
  contactService = inject(ContactService);
  authService = inject(AuthService);
  router = inject(Router);

  searchQuery = signal<string>('');
  isModalVisible = false;
  selectedContact: Contact | null = null;
  loggedInUser = localStorage.getItem('loggedInEmail') || sessionStorage.getItem('loggedInEmail') || 'eve.holt@reqres.in';

  filteredContacts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const contacts = this.contactService.contacts();

    if (!query) return contacts;

    return contacts.filter((c: Contact) =>
      c.firstName.toLowerCase().includes(query) ||
      c.lastName.toLowerCase().includes(query) ||
      c.city.toLowerCase().includes(query)
    );
  });

  sortFnName = (a: Contact, b: Contact) => a.lastName.localeCompare(b.lastName);
  sortFnFirstName = (a: Contact, b: Contact) => a.firstName.localeCompare(b.firstName);
  sortFnCity = (a: Contact, b: Contact) => a.city.localeCompare(b.city);
  sortFnBirthDate = (a: Contact, b: Contact) => new Date(a.birthDate).getTime() - new Date(b.birthDate).getTime();

  onSearchChange(value: string) {
    this.searchQuery.set(value);
  }

  deleteContact(id: string) {
    this.contactService.deleteContact(id);
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('loggedInEmail');
    sessionStorage.removeItem('loggedInEmail'); 
    this.router.navigate(['/login']);
  }

  openAddModal() {
    this.selectedContact = null;
    this.isModalVisible = true;
  }

  openEditModal(contact: Contact) {
    this.selectedContact = contact;
    this.isModalVisible = true;
  }

  closeModal() {
    this.isModalVisible = false;
    this.selectedContact = null;
  }
}