package com.tale.model.params;

import lombok.Data;

/**
 * @author biezhi
 * @date 2018/6/10
 */
@Data
public class AdvanceParam {

    private String cacheKey;
    private String blockIps;
    private String pluginName;
    private String cdnURL;
    private String allowInstall;
    private String allowCommentAudit;
    private String allowCloudCDN;

}
