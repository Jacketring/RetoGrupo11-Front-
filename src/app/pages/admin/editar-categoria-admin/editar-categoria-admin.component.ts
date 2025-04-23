import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriaService } from '../../../services/categoria.service';
import { CategoriaDto } from '../../../interfaces/categoria-dto';

@Component({
  selector: 'app-editar-categoria-admin',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './editar-categoria-admin.component.html',
  styleUrl: './editar-categoria-admin.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditarCategoriaAdminComponent {
  form!: FormGroup;
  idCategoria!: number;
  error: string | null = null;
  loading = false;

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private categoriaService = inject(CategoriaService);
  private cd = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.idCategoria = +this.route.snapshot.paramMap.get('id')!;
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required],
    });

    this.categoriaService.getCategoriaById(this.idCategoria).subscribe({
      next: (categoria) => this.form.patchValue(categoria),
      error: (err) => {
        this.error = 'No se pudo cargar la categoría.';
        console.error(err);
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    const categoriaEditada: CategoriaDto = this.form.value;

    this.categoriaService.updateCategoria(this.idCategoria, categoriaEditada).subscribe({
      next: () => {
        alert('Categoría actualizada correctamente');
        this.router.navigate(['/admin/categorias']);

      },
      error: (err) => {
        this.error = 'No se pudo actualizar la categoría.';
        console.error(err);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

}
