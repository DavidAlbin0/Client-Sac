import { Component, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Proveedor } from 'src/app/models/vendor';
import { Global } from 'src/app/services/global';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [ProjectService]
})
export class RegisterComponent implements OnInit {
  public vendor: Proveedor;
  public url: string;
  public identity:any;
  public title:string;
  public captcha: string;
  public email:string;
  
  
  constructor(
    private _projectService: ProjectService,
    private _router:Router,
    private _route: ActivatedRoute
  ) { 
    this.vendor = new Proveedor('','','','','','','','',0,'',false,[''],'',false, new Date(), new Date(), new Date(),false);
    this.url = Global.url;
    this.title="Registro de";
    this.captcha = '';
    this.email = 'sacmag.proveedores@gmail.com';
    this.identity =this._projectService.getIdentity();
    if(this.identity.rol && this.identity.rol.toLowerCase()== 'proveedor'){
      this._router.navigate(['/inicio']);
    }
    
  }
  resolved(captchaResponse:string){
    this.captcha =captchaResponse;
    console.log('Resolvió captcha' + this.captcha);
  }

  ngOnInit(): void {

   /*  this._route.params.subscribe(params =>{
      let id = params.id;
      this.identity =this._projectService.getIdentity(); */
      //console.log(this.identity['rol']);
      
      /* if(this.identity['rol'] === "administrador" || this.identity['rol'] === "usuario" ){
        
        this.getVendor(id);
       

      }
      if(this.identity['rol'] === "proveedor"){
        this.title ="Datos";
        this.vendor.rfc = this.identity['rfc'];
        this.vendor.registroPatronal = this.identity['registroPatronal'];
        var seccion = <HTMLElement>  document.querySelector('.registro');
        seccion.style.display = 'none';
      } 
      
        
      
      
      
    })*/
  }
  onSubmit(form:any){
    var opcion = confirm("¿Estás seguro de enviar la  información?");
    if(opcion == true){
   
      this._projectService.saveVendor(this.vendor).subscribe(
        response=>{
          console.log(response.message);
          alert(response.message);
          form.reset();
          window.location.reload();
  
        },
        error=>{
          alert('Ocurrió un error: ' +error.error.message);
  
        }
      )
    }

    
  }
  /*getVendor(id:any){
    this._projectService.getVendor(id).subscribe(
      response=>{
        
        this.vendor = response.vendor;
        if(response.vendor){
          this.title ="Datos";
        }
        
        
      }, error=>{
        console.log(<any>error);
      }
    )
  }*/
  valid(){
    if(this.vendor.rfc.trim().length < 12 || this.vendor.rfc.trim().length > 13){
      this.vendor.rfc = '';
    }
  }

}

