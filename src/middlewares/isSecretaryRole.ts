import Secretary from '../Secretary/entity/Secretaria.entity'

export const isSecretaryRole = async(codRole:number)=>{
    const role = await Secretary.findOneBy({where:{nombre:"secretaria"}})

    if(role!.id !== codRole){
        throw new Error("No tienes privilegios para realizar esta operacion")
    }
    return true
}