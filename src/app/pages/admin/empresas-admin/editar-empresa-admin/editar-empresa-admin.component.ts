import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from '../../../../services/empresa.service';
import { EmpresaRequestDto } from '../../../../interfaces/empresa-request-dto';

@Component({
  selector: 'app-editar-empresa-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-empresa-admin.component.html',
  styleUrl: './editar-empresa-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditarEmpresaAdminComponent {
  
  form!: FormGroup;
  idEmpresa!: number;
  loading = false;
  error: string | null = null;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaService);

  ngOnInit(): void {
    this.idEmpresa = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      cif: ['', Validators.required],
      nombreEmpresa: ['', Validators.required],
      direccionFiscal: ['', Validators.required],
      pais: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.empresaService.getEmpresaById(this.idEmpresa).subscribe({
      next: (empresa) => this.form.patchValue(empresa),
      error: (err) => {
        this.error = 'No se pudo cargar la empresa.';
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    const empresaEditada: EmpresaRequestDto = this.form.value;

    this.empresaService.updateEmpresa(this.idEmpresa, empresaEditada).subscribe({
      next: () => {
        alert('Empresa actualizada correctamente');
        this.router.navigate(['/admin/empresas']);
      },
      error: (err) => {
        this.error = 'No se pudo actualizar la empresa.';
        console.error(err);
      }
    });
  }

}
