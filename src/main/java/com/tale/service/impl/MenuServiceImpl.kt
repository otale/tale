package com.tale.service.impl

import com.blade.ioc.annotation.Inject
import com.blade.ioc.annotation.Service
import com.blade.jdbc.ActiveRecord
import com.blade.jdbc.core.Take
import com.tale.dto.Types
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

    override fun getById(id: Int): Contents? {
        return null
    }

    override fun saveMenu(menu: Contents?) {
        activeRecord?.update(menu)
    }


    override fun delMenu(id: Int) {
        activeRecord?.delete(Contents::class.java, id)
    }

    override fun getMenus(): MutableList<Contents>? {
        val SQL = "SELECT * FROM t_contents AS content WHERE content.type = 'page'"
        return activeRecord?.list(Contents::class.java, SQL)
    }

}