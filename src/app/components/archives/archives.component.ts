import { Component, OnInit} from '@angular/core';
import { ProjectService } from 'src/app/services/project.service';
import { Proveedor } from 'src/app/models/vendor';
import { Global } from 'src/app/services/global';
import { Router, ActivatedRoute, Params, RouterModule } from '@angular/router';
import { Archivo } from 'src/app/models/archive';
import { UploadService } from 'src/app/services/upload.service';
import { SearchPipe } from '../../pipes/search.pipe';


@Component({
  selector: 'app-archives',
  templateUrl: './archives.component.html',
  styleUrls: ['./archives.component.css'],
  providers: [ProjectService, UploadService]
})
export class ArchivesComponent implements OnInit {
  public vendor: Proveedor;
  public identity:any;
  public archivos: Archivo;
  public url:string;
  public  rfc : any;
  public charge: boolean;
  public changeDataEmail: boolean;
  public currentYear: number = new Date().getFullYear();
  public archives: Archivo[] = [];
  public filtroValor: string = "";
  public filterArchives: any[] = [];
  public dataFilter: any[] = [];
 

  
  public filesToUpload: Array<File[]>;
  public fileToUpload : Array<File> = [];

  constructor(private _projectService: ProjectService, 
    private _uploadService: UploadService,
    private _router:Router,
    private _route: ActivatedRoute) { 
    this.vendor = new Proveedor('','','','','','','','',0,'',false,[''],'',false,new Date(),new Date(), new Date(),false);
      this.archivos = new Archivo('','','','','','','','','','','','','','','','','',false,false,false, new Date());
      this.identity =this._projectService.getIdentity();
      this.filesToUpload=[];
      this.url = Global.url;
      this.charge = false;
      this.changeDataEmail = false;
      
    
    
  
      
  
      
      
      
      
    }
   

  ngOnInit(): void {
    if(this.identity.rol.toLowerCase().trim() === "proveedor" || this.identity.rol.toLowerCase().trim() === undefined ){
      var rfc = <HTMLInputElement>document.getElementById('rfc');
      var regP =<HTMLInputElement>document.getElementById('regP');
      var razonS= <HTMLInputElement>document.getElementById('razonS');
      rfc.disabled= true;
      regP.disabled = true;
      razonS.disabled = true;   
      var botones = document.querySelectorAll('.bton');
        for(var i = 0; i < botones.length;i++){
          var boton = <HTMLInputElement> botones[i];
          boton.style.display= 'none';
        }
    }
    if(this.identity['rol'] === "proveedor" ){
      this.getVendorRfc(this.identity['rfc']);
      
    }
    
    if(this.identity['rol'] != "proveedor" ){
      this._route.params.subscribe(params =>{
        let id = params.id;
        
        this.getVendor(id);
      })
    }
      
      
    
    }
  getAllArchives(rfc:any, supter:boolean){
    
      this._projectService.getAllArchives(localStorage.getItem("rfc"), supter).subscribe(
        response=>{
          this.archives = response.findArchives;
          
        },error =>{
          console.log(<any>error);
  
        }
      )
  
    }
 
    getVendor(id:any){
      this._projectService.getVendor(id).subscribe(
        response=>{
         
         this.vendor = response.vendor;
         
         this.vendor.rfc =this.vendor.rfc.toUpperCase();
         this.vendor.registroPatronal = this.vendor.registroPatronal.toUpperCase();
         this.vendor.razonSocial = this.vendor.razonSocial.toUpperCase();
         this.vendor.nombreContacto = this.vendor.nombreContacto.toUpperCase();
         if(this.vendor.observaciones){
          this.vendor.observaciones = this.vendor.observaciones.toUpperCase();
         }
         
         this.vendor.correo = this.vendor.correo.toLowerCase();
        
         
         
         localStorage.setItem('rfc', this.vendor.rfc);
         this.getArchives(this.vendor.rfc,this.vendor.supter); 
         this.getAllArchives(this.vendor.rfc, this.vendor.supter);
         if(this.vendor.regimenFiscal == 'fisica'){
          var ocultos = document.querySelectorAll('.ocultar');
          for(var i = 0; i < ocultos.length;i++){
            var oculto = <HTMLInputElement> ocultos[i];
            oculto.style.display= 'none';
        }
         }
        }, error=>{
          console.log(<any>error);
        }
      )
    }
    getVendorRfc(rfc:string){
   
      this._projectService.getVendorRfc(rfc).subscribe(
        response =>{
          this.vendor = response.vendor;
          this.vendor.rfc = this.vendor.rfc.toUpperCase();
          this.vendor.registroPatronal = this.vendor.registroPatronal.toUpperCase();
          this.vendor.razonSocial = this.vendor.razonSocial.toUpperCase();
  
          this.vendor.nombreContacto = this.vendor.nombreContacto.toUpperCase();
          if(this.vendor.observaciones){
           this.vendor.observaciones = this.vendor.observaciones.toUpperCase();
          }
          
          this.vendor.correo = this.vendor.correo.toLowerCase();
          
          localStorage.setItem('rfc', this.vendor.rfc);
          this.getArchives(this.vendor.rfc, this.vendor.supter);
          this.getAllArchives(this.vendor.rfc, this.vendor.supter);
          if(this.vendor.regimenFiscal == 'fisica'){
            var ocultos = document.querySelectorAll('.ocultar');
            for(var i = 0; i < ocultos.length;i++){
              var oculto = <HTMLInputElement> ocultos[i];
              oculto.style.display= 'none';
          }
           }
          
          }, error=>{
          console.log(<any>error);
        }
      )
    }
  getArchives(rfc:string, supter:boolean){
    var files = document.querySelectorAll('.file');
    this._projectService.getArchives(rfc,supter).subscribe(
      response=>{
        this.archivos = response.getArchives;
        if(this.archivos == null && this.identity.rol == 'proveedor')alert(`No existen archivos correspondientes al año actual ${this.currentYear}, por favor subir archivos`);
        
        
        
        
      for(var i = 0; i < files.length;i++){
        var file = <HTMLInputElement> files[i];
        file.style.display= 'none';
    }
        
        
      },error=>{
        console.log(<any>error.error.message);
        
      })
  }
  /* obtenerArchivo(archivo:string){
    this._projectService.getArchive(archivo).subscribe(
      response=>{
        //console.log(response.path_file)
      }, error=>{
        console.log(<any>error);
      }
    )
  } */
  onSubmit(){
    
    if(this.filesToUpload[0].length != 0 && this.filesToUpload[1].length != 0 && 
      this.filesToUpload[2].length != 0 && this.filesToUpload[3].length != 0 && 
      this.filesToUpload[5].length != 0 && this.filesToUpload[6].length != 0 && 
      this.filesToUpload[7].length != 0 && this.filesToUpload[8].length != 0 &&
      this.filesToUpload[9].length != 0 && this.filesToUpload[10].length != 0 &&
      this.filesToUpload[11].length != 0 && this.filesToUpload[12].length != 0 &&
      this.filesToUpload[13].length != 0 && this.filesToUpload[14].length != 0 ){

        
        var opcion = confirm("¿Estás seguro de enviar la información?");
        if(opcion == true){
          this.charge = true;
          let Cd = new Date();
          this._uploadService.makeFileRequest(Global.url+"subir-archivos/"+ localStorage.getItem('rfc')+ "/"+ this.vendor.supter,[],this.filesToUpload).then((result:any)=>{
            //console.log(result);
            this.refresh();
            this.charge = false;
            alert('Los archivos fueron enviados exitosamente');
      
          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
            this.charge =false;
          })
        }
    }else{
      alert('Recuerda llenar los campos requeridos');
    }
  }
  fileChangeEvent1(fileInput: any, id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
      this.fileToUpload = <Array<File>>fileInput.target.files;
      let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
      if(opcion == true){
        this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
          //console.log(result);
          this.refresh();
          alert('El archivo fue actualizado correctamente');
        }, error=>{
          console.log(error);
          alert('Ocurrió un error ' + error);
        })
      }else{
        this.refresh();
      }
      }else{
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.fileToUpload = [];
      }
    }

    else{
    if(fileInput.target.files[0].size > 2000000){
      
      alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
      this.filesToUpload[0] = [];
    }else{
      this.filesToUpload[0]=<Array<File>>fileInput.target.files;      
    }
  }
  }
  fileChangeEvent2(fileInput: any , id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');
          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();
        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }
    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[1] = [];
      }else{
        this.filesToUpload[1]=<Array<File>>fileInput.target.files;
      }
  }
    
    
  }
  fileChangeEvent3(fileInput: any, id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');
          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();
        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }
    }else{

    
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[2] = [];
      }else{
        this.filesToUpload[2]=<Array<File>>fileInput.target.files;
      }
  }
    
   
  }
  fileChangeEvent4(fileInput: any , id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');
          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();
        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }
    
    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[3] = [];
      }else{
        this.filesToUpload[3]=<Array<File>>fileInput.target.files;
      }
  }
   
    
    
  }
  fileChangeEvent5(fileInput: any, id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 5000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');
          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();
        }
      }else{
          alert('El archivo excede el tamaño permitido de 5 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }
    }else{
      if(fileInput.target.files[0].size > 5000000){
        alert('El archivo excede el tamaño permitido de 5 MB, selecciona un archivo válido');
        this.filesToUpload[4] = [];
      }else{
        this.filesToUpload[4]=<Array<File>>fileInput.target.files;
      }
  }
    
    
  }
  fileChangeEvent6(fileInput: any , id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');

          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();

        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }

    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[5] = [];
      }else{
        this.filesToUpload[5]=<Array<File>>fileInput.target.files;
      }
    }
    
    
    
  }
  fileChangeEvent7(fileInput: any , id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');

          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();

        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }

    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[6] = [];
      }else{
        this.filesToUpload[6]=<Array<File>>fileInput.target.files;
      }
    }
    
    
/*     console.log(this.filesToUpload); */
  }
  fileChangeEvent8(fileInput: any , id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');

          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();

        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }

    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[7] = [];
      }else{
        this.filesToUpload[7]=<Array<File>>fileInput.target.files;
      }
    }
    
   
    
  }
  fileChangeEvent9(fileInput: any , id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');

          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();

        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }

    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[8] = [];
      }else{
        this.filesToUpload[8]=<Array<File>>fileInput.target.files;
      }

    }
    
    
    
  }
  fileChangeEvent10(fileInput: any, id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');

          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();

        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }
    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[9] = [];
      }else{
        this.filesToUpload[9]=<Array<File>>fileInput.target.files;
      }
    }
    
    
    
  }
  fileChangeEvent11(fileInput: any , id: any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');

          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();

        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }
    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[10] = [];
      }else{
        this.filesToUpload[10]=<Array<File>>fileInput.target.files;
      }

    }
    
    
    
  }
  fileChangeEvent12(fileInput: any, id:any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');

          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();

        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }
    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[11] = [];
      }else{
        this.filesToUpload[11]=<Array<File>>fileInput.target.files;
      }
    }
    
    
    
  }
  fileChangeEvent13(fileInput: any, id:any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');

          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();

        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }

    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[12] = [];
      }else{
        this.filesToUpload[12]=<Array<File>>fileInput.target.files;
      }
    }
    
    
    
  }
  fileChangeEvent14(fileInput: any, id:any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');

          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();

        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }
    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[13] = [];
      }else{
        this.filesToUpload[13]=<Array<File>>fileInput.target.files;
      }
    }
    
    
    
  }
  fileChangeEvent15(fileInput: any, id:any){
    this.fileToUpload = [];
    if(this.archivos){
      if(fileInput.target.files[0].size < 2000000){
        this.fileToUpload = <Array<File>>fileInput.target.files;
        let opcion = confirm("Ya cuentas con un archivo. ¿Estás seguro de remplazar el archivo?");
        if(opcion == true){
          this._uploadService.makeFileRequestArchive(Global.url+"upload-archive/"+ this.archivos._id+ "/"+ id+"/"+this.archivos.rfc,[],this.fileToUpload,'archive').then((result:any)=>{
            //console.log(result);
            this.refresh();
            alert('El archivo fue actualizado correctamente');

          }, error=>{
            console.log(error);
            alert('Ocurrió un error ' + error);
          })
        }else{
          this.refresh();

        }
      }else{
          alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
          this.fileToUpload = [];
      }
    }else{
      if(fileInput.target.files[0].size > 2000000){
        alert('El archivo excede el tamaño permitido de 2 MB, selecciona un archivo válido');
        this.filesToUpload[14] = [];
      }else{
        this.filesToUpload[14]=<Array<File>>fileInput.target.files;
      }
    }
  }
  
  habilitar(){
    var opcion = confirm("¿Estás seguro de modificar la información?");
    if(opcion == true){
      var files = document.querySelectorAll('.file');
    for(var i = 0; i < files.length;i++){
      var file = <HTMLInputElement> files[i];
      file.style.display= 'block';
  }
    }
    

  }
  rechazar(){
    var mensaje  = prompt("Redactar motivo por el rechazo de archivos?");
    var opcion = confirm("¿Estás seguro de enviar la  información?");
    if(opcion == true){
    this._projectService.refuseArchives(this.vendor.rfc, mensaje).subscribe(
      response=>{
        //console.log(response.vendor);
        alert('Los archivos fueron rechazados exitosamente');
        this.refresh(); 

      },
      error=>{
        alert('Ocurrió un error: ' +error.error.message);

      } 
    )
  }
  }
  validar(){
    if(this.identity['rol'] === "administrador" || this.identity['rol'] === "usuario"){
    
      var opcion = confirm("¿Estás seguro de enviar la  información?");
    if(opcion == true){
    this._projectService.validateArchives(this.vendor.rfc, this.vendor.supter).subscribe(
      response=>{
        /* console.log(response.archives); */
        alert('Los archivos fueron validados correctamente');
        this.refresh();

      },
      error=>{
        alert('Ocurrió un error: ' +error.error.message);

      } 
    )
    }

    }else{
      alert('No tienes permisos suficientes');
    }
    

  }
  refresh(): void { window.location.reload(); }
  onSubmitU(){
    if(this.changeDataEmail == true){
      var emailchange = confirm("Se detectó cambio de correo, ¿Deseas reenviar la información al nuevo correo del proveedor?");
      if(emailchange == true){
        this.changeDataEmail = true;
      }else{
        this.changeDataEmail = false;
      }

    }
  
    var opcion = confirm("¿Estás seguro de enviar la  información?");
    if(opcion == true){
      //console.log(this.vendor);
      this._projectService.updateVendor(this.vendor,this.changeDataEmail).subscribe(
        response=>{
          
          alert('El Usuario fue registrado correctamente');
          this.refresh();
          this.changeDataEmail = false;
        },
        error=>{
         
          alert('Ocurrió un error: ' +error.error.message);
          
        }
        
      )
    }
   
  }
  changeData(){
    this.changeDataEmail = true;
    
  }
  validateVendorInfo(){
    
    var opcion = confirm("¿Estás seguro de enviar la  información?");
    
    if(opcion == true){
    this._projectService.validateVendorInfo(this.vendor).subscribe(
      response =>{
        alert(response.message);
        this.refresh();
      },
      error =>{
        alert('Ocurrió un error: ' +error.error.message);
      })
    }

  }
  search(text: string){
    this.filtroValor = text.trim();
    this.dataFilter = [];
    
    for(let i = 0 ; i < this.archives.length; i++){
      this.filterArchives =  Object.values(this.archives[i]);
      this.filterArchives.splice(17,5);
      this.filterArchives.splice(0,2);
      this.dataFilter = this.dataFilter.concat(this.filterArchives);
      
    }
    this.dataFilter= this.dataFilter.filter( val => val.toString().toUpperCase().includes(text.toUpperCase()));
    

    
    
    
  }


}
