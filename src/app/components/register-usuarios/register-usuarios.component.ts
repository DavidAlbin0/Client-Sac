import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/user';
import { ProjectService } from 'src/app/services/project.service';
import { Global } from 'src/app/services/global';



@Component({
  selector: 'app-register-usuarios',
  templateUrl: './register-usuarios.component.html',
  styleUrls: ['./register-usuarios.component.css'],
  providers: [ProjectService]
})
export class RegisterUsuariosComponent implements OnInit {
  public us: Usuario;
  public pass: any;
  public identity: any;
  public flagDelete:boolean = false;
  public todas:string = 'todasSacmag';
  
  constructor(
    private _projectService: ProjectService
    ) { 
    this.us = new Usuario('','','','','','','','','', '',false);
  }

  ngOnInit(): void {
    this.identity =this._projectService.getIdentity();
    var pass = <HTMLInputElement>document.getElementById('passw');
    pass.style.display = 'none';
    
    if(this.identity['rol'] === "proveedor"){
      var seccion = <HTMLElement>  document.querySelector('.registro');
      seccion.style.display = 'none';
    }
    
  }
  onSubmit(form:any){
    var opcion = confirm("¿Estás seguro de enviar la  información?");
    if(opcion == true){
      this._projectService.saveUsers(this.us).subscribe(
        response=>{
          //console.log(response);
          alert('El Usuario fue registrado correctamente');
          form.reset();
        },
        error=>{
          alert('Ocurrió un error: ' +error.error.message);
  
        }
      )
    }
  }
  mostrar(){
    
    var pass = <HTMLInputElement>document.getElementById('passw');
    var list = <HTMLInputElement>document.getElementById('tipoEmpresa');
    const option = <HTMLOptionElement> document.createElement('option');
    option.value = this.todas;
    option.text = 'TODAS';
    if(this.us.rol == 'administrador'){
      list.disabled = true;
      pass.style.display = 'block';
      this.us.empresa = this.todas
      if(this.flagDelete == true){
        list.appendChild(option)
        this.flagDelete = false
      };
    }else if(this.us.rol == 'contador'){
      list.disabled = true;
      this.us.empresa = this.todas
      pass.style.display = 'none';
      if(this.flagDelete == true){
        list.appendChild(option);
        this.flagDelete = false
      }
      
    }else{
      list.disabled = false;
      pass.style.display = 'none';
      this.us.empresa = '';
      let all = <HTMLInputElement>document.querySelector(`#tipoEmpresa option[value=${this.todas}]`);
      all.remove();
      this.flagDelete = true;

    }
  }
  valid(){
    if(this.us.rfc.trim().length < 12 || this.us.rfc.trim().length > 13){
      this.us.rfc = '';
    }
  }
  text(id: string){
    var tipo = <HTMLInputElement> document.getElementById(id);
      if(tipo.type == "password"){
          tipo.type = "text";
      }else{
          tipo.type = "password";
      }
  }
  

}
