// export interface IdCheckRes {
//     index: number,
//     entities: any[]
// }
//
// export class MKController {
//     public static async checkIdExists(ids: number[], repo: any): Promise<IdCheckRes> {
//         let index = 0
//         let entities = []
//         let res: IdCheckRes = {index: -1, entities}
//
//         try {
//             let entity = await repo.findOneOrFail(ids)
//             res.entities.push(entity)
//
//         } catch (e) {
//             console.log('there is an error', e)
//         }
//
//
//         if (index === ids.length) {
//             res.index = -1
//         } else {
//             res.index = ids[index]
//         }
//         return res
//     }
// }

export interface IdCheckRes {
    index: number,
    entities: any[]
}
export class MKController{
    public static async checkIdExists(ids: number[], repo: any): Promise<IdCheckRes>{
        let index = 0
        let entities = []
        let res: IdCheckRes = {index: -1, entities}
        for (index = 0 ; index < ids.length; index++){
            try {
                let entity = await repo.findOneOrFail(ids[index])
                res.entities.push(entity)

            }catch (e){
                break
            }
        }//

        if (index === ids.length){
            res.index = -1
        }else {
            res.index = ids[index]
        }
        return res
    }
}

