import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VacantesViewComponent } from './pages/vacantes-view/vacantes-view.component';
import { PublicLayoutComponent } from './pages/public-layout/public-layout.component';

// 👇 IMPORTAR guards por rol cuando los tengas
import { ClienteGuard } from './guards/cliente.guard';
import { EmpresaGuard } from './guards/empresa.guard';
import { AdminGuard } from './guards/admin.guard';

// TODO: reemplazar por tus componentes reales:
import { HomeComponent } from './pages/home/home.component'; // puede quedar como dashboard por rol
import { AdminHomeComponent } from './pages/admin/admin-home/admin-home.component';

export const routes: Routes = [
  // 🔓 Rutas públicas
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
    { path: '', component: VacantesViewComponent },
      { path: 'vacantes', component: VacantesViewComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
    ],
  },

  // 🔐 Cliente
  {
    path: 'cliente',
    canActivate: [ClienteGuard],
    component: HomeComponent, // o ClienteLayout si lo prefieres
    children: [
      { path: '', redirectTo: 'mis-solicitudes', pathMatch: 'full' },
      { path: 'mis-solicitudes', loadComponent: () => import('./pages/cliente/mis-solicitudes/mis-solicitudes.component').then(m => m.MisSolicitudesComponent) },
      { path: 'solicitud/:id', loadComponent: () => import('./pages/cliente/detalle-solicitud/detalle-solicitud.component').then(m => m.DetalleSolicitudComponent) },
      { path: 'aplicar/:idVacante', loadComponent: () => import('./pages/cliente/postular-vacante/postular-vacante.component').then(m => m.PostularVacanteComponent) },
      { path: 'editar-perfil', loadComponent: () => import('./pages/cliente/editar-perfil/editar-perfil.component').then(m => m.EditarPerfilComponent) },
    ],
  },

  // 🔐 Empresa
  {
    path: 'empresa',
    canActivate: [EmpresaGuard],
    component: HomeComponent, // o EmpresaLayout si tienes uno
    children: [
      { path: '', redirectTo: 'mis-vacantes', pathMatch: 'full' },
      { path: 'mis-vacantes', loadComponent: () => import('./pages/empresa/mis-vacantes/mis-vacantes.component').then(m => m.MisVacantesComponent) },
      { path: 'vacante/nueva', loadComponent: () => import('./pages/empresa/crear-vacante/crear-vacante.component').then(m => m.CrearVacanteComponent) },
      { path: 'vacante/editar/:id', loadComponent: () => import('./pages/empresa/editar-vacante/editar-vacante.component').then(m => m.EditarVacanteComponent) },
      { path: 'solicitudes/:idVacante', loadComponent: () => import('./pages/empresa/solicitudes-vacante/solicitudes-vacante.component').then(m => m.SolicitudesVacanteComponent) },
      { path: 'datos', loadComponent: () => import('./pages/empresa/editar-empresa/editar-empresa.component').then(m => m.EditarEmpresaComponent) },
    ],
  },

  // 🔐 Admin
  {
    path: 'admin',
    canActivate: [AdminGuard],
    component: HomeComponent, // o AdminLayout
    children: [
        { path: '', component: AdminHomeComponent }, // 👈 default
        { path: 'empresas', loadComponent: () => import('./pages/admin/empresas-admin/empresas-admin.component').then(m => m.EmpresasAdminComponent) },
        { path: 'categorias', loadComponent: () => import('./pages/admin/categorias-admin/categorias-admin.component').then(m => m.CategoriasAdminComponent) },
        { path: 'usuarios', loadComponent: () => import('./pages/admin/usuarios-admin/usuarios-admin.component').then(m => m.UsuariosAdminComponent) },
        { path: 'admins', loadComponent: () => import('./pages/admin/administradores/administradores.component').then(m => m.AdministradoresComponent) },
    ],
  },
];
