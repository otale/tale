package com.tale.model.dto;

import com.tale.model.entity.Metas;
import lombok.Data;
import lombok.ToString;

/**
 * Created by biezhi on 2017/2/22.
 */
@Data
@ToString(callSuper = true)
public class MetaDto extends Metas {

    private int count;

}
