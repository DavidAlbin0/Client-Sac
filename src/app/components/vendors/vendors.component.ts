import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/models/vendor';
import { ProjectService } from 'src/app/services/project.service';
import { Global } from 'src/app/services/global';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-vendors',
  templateUrl: './vendors.component.html',
  styleUrls: ['./vendors.component.css'],
  providers: [ProjectService]
})
export class VendorsComponent implements OnInit {
  public vendors : Proveedor[];
  public proveedores: Array<any>;
  public identity;


  constructor(
    private _projectService: ProjectService
  ) { 
    this.vendors = [];
    this.proveedores = [];
   
    this.identity =this._projectService.getIdentity(); 
  
   
    
  }

  ngOnInit(): void {
    
    if(this._projectService.getToken() != undefined){
      this.getVendors();
    }else{
      console.log("No hay proveedores");
    }
    this.search.valueChanges.pipe(debounceTime(300)).
    subscribe(value=> this.vendors);
    
  }
  handleSearch(value: any){
    this.filtroValor = value;
  }
  search = new FormControl('');
  filtroValor = '';
  getVendors(){
    this._projectService.getVendors(this.identity['empresa']).subscribe(
      response =>{
        if(response.AllVendors){
          this.vendors = response.AllVendors;
          //console.log(this.vendors[0]['empresa'].length);
        
          
          
        }
      },
      error =>{
        console.log(<any>error)
      }
    )
  }
 
  

}
