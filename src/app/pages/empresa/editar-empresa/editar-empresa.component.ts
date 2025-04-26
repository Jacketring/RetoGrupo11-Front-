import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EmpresaService } from '../../../services/empresa.service';
import { EmpresaResponseDto } from '../../../interfaces/empresa-response-dto';

@Component({
  selector: 'app-editar-empresa',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-empresa.component.html',
  styleUrl: './editar-empresa.component.css',
  standalone: true
})
export class EditarEmpresaComponent {
  form!: FormGroup;
  loading = false;

  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaService);
  private router = inject(Router);

  ngOnInit(): void {
    this.form = this.fb.group({
      nombreEmpresa: ['', Validators.required],
      cif: ['', Validators.required],
      direccionFiscal: [''],
      pais: ['']
    });

    this.empresaService.getMiEmpresa().subscribe({
      next: (empresa: EmpresaResponseDto) => {
        this.form.patchValue({
          nombreEmpresa: empresa.nombreEmpresa,
          cif: empresa.cif,
          direccionFiscal: empresa.direccionFiscal,
          pais: empresa.pais
        });
        console.log(empresa)
      },
      error: (err) => {
        console.error('Error cargando empresa:', err);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;

    this.empresaService.updateMiEmpresa(this.form.value).subscribe({
      next: () => {
        alert('Datos de empresa actualizados correctamente');
        this.router.navigate(['/empresa/mis-vacantes']); // o quedarse en /datos
      },
      error: (err) => {
        console.error('Error al actualizar empresa:', err);
        alert('Error al actualizar empresa');
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
