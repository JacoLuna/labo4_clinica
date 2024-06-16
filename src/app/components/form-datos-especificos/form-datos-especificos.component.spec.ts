import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDatosEspecificosComponent } from './form-datos-especificos.component';

describe('FormDatosEspecificosComponent', () => {
  let component: FormDatosEspecificosComponent;
  let fixture: ComponentFixture<FormDatosEspecificosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDatosEspecificosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormDatosEspecificosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
