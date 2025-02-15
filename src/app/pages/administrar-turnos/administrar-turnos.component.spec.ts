import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarTurnosComponent } from './administrar-turnos.component';

describe('AdministrarTurnosComponent', () => {
  let component: AdministrarTurnosComponent;
  let fixture: ComponentFixture<AdministrarTurnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministrarTurnosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministrarTurnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
