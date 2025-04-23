import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmpresaResponseDto } from '../../../interfaces/empresa-response-dto';
import { EmpresaService } from '../../../services/empresa.service';

@Component({
  selector: 'app-empresas-admin',
  imports: [CommonModule, RouterModule],
  templateUrl: './empresas-admin.component.html',
  styleUrl: './empresas-admin.component.css',
  standalone: true,
})
export class EmpresasAdminComponent {

  empresas: EmpresaResponseDto[] = [];
  private empresaService = inject(EmpresaService);

  ngOnInit() {
    this.empresaService.getEmpresas().subscribe({
      next: (data) => this.empresas = data,
      error: (err) => console.error('Error cargando empresas', err),
    });
  }

  confirmarEliminar(id: number) {
    const confirmado = confirm('¿Estás seguro de que deseas eliminar esta empresa? Esta acción no se puede deshacer.');
  
    if (confirmado) {
      this.empresaService.deleteEmpresa(id).subscribe({
        next: () => {
          alert('Empresa eliminada correctamente');
          this.empresas = this.empresas.filter(e => e.idEmpresa !== id); // actualiza la vista
        },
        error: (err) => {
          console.error('Error al eliminar empresa:', err);
          alert('No se pudo eliminar la empresa.');
        }
      });
    }
  }
}
