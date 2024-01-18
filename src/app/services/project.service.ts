import { Injectable } from "@angular/core";
import { catchError } from "rxjs/operators";
import { HttpClient, HttpHeaders} from "@angular/common/http";
import{Observable} from 'rxjs';
import { Usuario } from '../models/user';
import { Proveedor } from "../models/vendor";
import { Archivo } from "../models/archive";

import { Global } from "./global";

//Decorador injectable para inyectar clases de dependencias en los componentes

@Injectable()
export class ProjectService{
    public url: string;
    public identity: any;
    public token: any;
    public rfc : any;

    constructor(public _http: HttpClient){
        this.url = Global.url;


    }


    //Identificar error

  /**  signup(user: any, gettoken: any = null): Observable<any> {
      if (gettoken != null) {
          user = Object.assign(user, { gettoken });
      }

      let params = JSON.stringify(user);
      let headers = new HttpHeaders().set('Content-Type', 'application/json');

      return this._http.post(this.url + 'login', params, { headers: headers });
  }
*/
  signup(user: any, gettoken: any = null): Observable<any> {
    if (gettoken != null) {
      user = Object.assign(user, { gettoken });
    }

    let params = JSON.stringify(user);
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this._http.post(this.url + 'login', params, { headers: headers }).pipe(
      catchError((error: any) => {
        console.error('Error en la solicitud:', error);
        throw error; // Lanza el error para que sea manejado en la suscripción del componente.
      })
    );
  }


    //Termina parte a identificar

    getIdentity(){
        let identity = '';
        identity = JSON.parse(localStorage.getItem('identity') || '{}');
        if(identity != null){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }
    getRfc(){
        let rfc = '';
        rfc = localStorage.getItem('rfc') || '{}';
        if(rfc != null){
            this.rfc = rfc;
        }else{
            this.rfc = null;
        }
        return this.rfc;
    }
    getToken(){
        let token = localStorage.getItem('token');
        if(token != "undefined"){
            this.token = token;
        }
        else{
            this.token = null;
        }
        return this.token;
    }
    getUSer(userId:any): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        return this._http.get(this.url+'usuario/'+userId, {headers:headers});



    }
    saveVendor(user:Proveedor):Observable<any>{

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+'subir-proveedor', params, {headers:headers});


    }
    getVendors(empresa:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this._http.get(this.url+'proveedores/'+empresa, {headers:headers});

    }
    getVendor(id: any): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this._http.get(this.url+'proveedor/'+id, {headers:headers});
    }
    getVendorRfc(rfc: any): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this._http.get(this.url+'proveedorauth/'+rfc, {headers:headers});
    }
    saveArchives(archivo: Archivo):Observable<any>{

        let params = JSON.stringify(archivo);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this._http.post(this.url+'subir-archivos', params, {headers:headers});


    }
    getArchives(rfc:any,supter:boolean):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        return this._http.get(this.url+'obtener-archivos/'+rfc+"/"+supter, {headers:headers});

    }
    getArchive(file:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                       .set('Authorization', this.getToken());
        return this._http.get(this.url+'archivos/'+file, {headers:headers});


    }
    getAllArchives(rfc:any, supter:boolean):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        .set('Authorization', this.getToken());
        return this._http.get(this.url+'proveedor-archives/'+rfc+ '/'+ supter, {headers:headers});
    }
    refuseArchives(rfc:any, mensaje:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());

        return this._http.delete(this.url+'archivos/'+rfc+'/'+mensaje, {headers:headers});

    }
    validateArchives(rfc:any, supter:boolean): Observable<any>{


        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.put(this.url+'archivos/'+rfc+ '/'+supter, {headers:headers});


    }

    saveUsers(user:Usuario):Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());


        return this._http.post(this.url+'registro', params, {headers:headers});

    }
    updateVendor(user:Proveedor, send:any):Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        return this._http.put(this.url+'proveedor/'+user._id+'/'+send,params,{headers:headers});
    }
    changePassword(user:Usuario, newPass:any):Observable<any>{
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+ 'cambiar-info/'+newPass,params, {headers:headers});

    }
    forgotPass(usuario:any):Observable<any>{

        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.post(this.url+ 'forgot-pass/'+usuario, {headers:headers});

    }
    validateVendorInfo(vendor: Proveedor):Observable<any>{
        let params = JSON.stringify(vendor);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
                                        .set('Authorization', this.getToken());
        return this._http.put(this.url+'validar-Proveedor',params, {headers:headers});


    }




}
