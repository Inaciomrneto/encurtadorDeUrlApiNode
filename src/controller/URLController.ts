import { URLModel } from "../database/model/URL";
import { Request, Response } from "express";
import shortId from "shortid";
import {config} from '../config/Constants'

export class URLController {
  public async shorten(req: Request, res: Response): Promise<void>{
    
    //ver se a URL ja existe no banco
    const { originURL } = req.body
    const url = await URLModel.findOne({originURL})
    if (url){
      res.json(url)
      return
    }

    //criar o hash para a URL
    const hash = shortId.generate()
    const shortURL = `${config.API_URL}/${hash}`
    
    //salvar a URL no banco
    const newURL = await URLModel.create({hash, shortURL, originURL})
    res.json(newURL)
    //Retornar a URl salva
    res.json({originURL, hash, shortURL})
  }

  public async redirect(req: Request, res: Response): Promise<void>{
    //pegar hash da URL
    const {hash} = req.params
    const url = URLModel.findOne({hash})

    if(url){
    //Redirecionar para a URL original apartir da nova
    res.redirect((await url).originURL)
    return
    }
    res.status(400).json({error: 'URL not found'})
  }
}