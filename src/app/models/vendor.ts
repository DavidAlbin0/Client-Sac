export class Proveedor{
    constructor(
        public _id:string,
        public rfc:string,
        public registroPatronal:string,
        public razonSocial: string,
        public tipoProveedor: string,
        public regimenFiscal: string,
        public nombreContacto: string,
        public correo: string,
        public telefono: number,
        public observaciones: string,
        public borrado: boolean,
        public empresa: [String],
        public valido:string,
        public verificado: boolean,
        public fechaAlta: Date,
        public fechaArchivos: Date,
        public fechaActualizacionArchivos: Date,
        public supter: boolean
    ){

    }

}
