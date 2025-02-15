import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDatosPersonalesComponent } from './form-datos-personales.component';

describe('FormDatosPersonalesComponent', () => {
  let component: FormDatosPersonalesComponent;
  let fixture: ComponentFixture<FormDatosPersonalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDatosPersonalesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDatosPersonalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
