import { Component, Input, Output, EventEmitter, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { Contact, ContactService } from '../../../core/services/contact';

@Component({
  selector: 'app-contact-modal',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    NzModalModule, 
    NzFormModule, 
    NzInputModule, 
    NzDatePickerModule
  ],
  templateUrl: './contact-modal.html',
  styleUrls: ['./contact-modal.scss']
})
export class ContactModal implements OnChanges {
  @Input() isVisible = false;
  @Input() contactData: Contact | null = null;
  @Output() closeModal = new EventEmitter<void>();

  contactForm: FormGroup;
  fb = inject(FormBuilder);
  contactService = inject(ContactService);

  constructor() {
    this.contactForm = this.fb.group({
      lastName: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^07[0-9]{8}$')]],
      city: ['', [Validators.required]],
      birthDate: [null, [Validators.required]]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contactData'] || changes['isVisible']) {
      if (this.contactData) {
        this.contactForm.patchValue({
          ...this.contactData,
          birthDate: new Date(this.contactData.birthDate)
        });
      } else {
        this.contactForm.reset();
      }
    }
  }

  handleOk() {
    if (this.contactForm.valid) {
      const formValue = {
        ...this.contactForm.value,
        birthDate: this.contactForm.value.birthDate.toISOString()
      };

      if (this.contactData) {
        this.contactService.updateContact({ ...formValue, id: this.contactData.id });
      } else {
        this.contactService.addContact(formValue);
      }
      this.closeModal.emit();
    } else {
      Object.values(this.contactForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel() {
    this.closeModal.emit();
  }
}