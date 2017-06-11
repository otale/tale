package com.tale.service.impl

import com.blade.ioc.annotation.Inject
import com.blade.ioc.annotation.Service
import com.blade.jdbc.ActiveRecord
import com.blade.jdbc.core.Take
import com.tale.model.Contents
import com.tale.service.ContentsService
import com.tale.service.MenuService

/**
 * Created by lzd on 17-6-1.
 */
@Service
class MenuServiceImpl : MenuService {


    @Inject
    private val activeRecord: ActiveRecord? = null

    @Inject
    private val contentServicee: ContentsService? = null


    override fun saveMenu(menu: Contents?) {
        activeRecord?.update(menu)
    }


    override fun delMenu(contents:Contents) {
        contents.menu=0
        activeRecord?.update(contents)
    }

    override fun getMenus(): MutableList<Contents>? {
//        val SQL = "SELECT * FROM t_contents AS content WHERE content.type = 'page' AND menu > 0"
//        return activeRecord?.list(Contents::class.java, SQL)
        return activeRecord?.list(Take(Contents::class.java).eq("type", "page").gt("menu", 0).asc("menu"))
    }


    override fun getPages(): MutableList<Contents>? {
        val SQL = "SELECT * FROM t_contents AS content WHERE content.type = 'page'"
        return activeRecord?.list(Contents::class.java, SQL)
    }


}