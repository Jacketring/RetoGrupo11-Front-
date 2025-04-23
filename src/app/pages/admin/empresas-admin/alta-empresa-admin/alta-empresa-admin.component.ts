import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AltaEmpresaResponseDto } from '../../../../interfaces/alta-empresa-response-dto';
import { EmpresaAdminService } from '../../../../services/empresa-admin.service';
import { AltaEmpresaRequestDto } from '../../../../interfaces/alta-empresa-request-dto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alta-empresa-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alta-empresa-admin.component.html',
  styleUrl: './alta-empresa-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AltaEmpresaAdminComponent {

  form!: FormGroup;
  error: string | null = null;
  loading = false;

  private fb = inject(FormBuilder);
  private empresaService = inject(EmpresaAdminService);
  private router = inject(Router);


  ngOnInit() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required]],
      apellidoUsuario: ['', [Validators.required]],
      nombreEmpresa: ['', [Validators.required]],
      cif: ['', [Validators.required]],
      direccionFiscal: ['', [Validators.required]],
      pais: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = null;

    const request: AltaEmpresaRequestDto = this.form.value;

    this.empresaService.altaEmpresa(request).subscribe({
      next: (data) => {
        alert(
          `✅ Empresa registrada correctamente\n\n` +
          `🆔 Email: ${data.email}\n` +
          `🔐 Contraseña: ${data.password}\n\n` +
          `📌 IMPORTANTE: Esta contraseña solo se muestra una vez. Proporciónala al usuario.`
        );
      
        this.router.navigate(['/admin/empresas']);
      },
      error: (err) => {
        this.error = 'Error al registrar la empresa.';
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
