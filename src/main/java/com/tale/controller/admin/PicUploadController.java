package com.tale.controller.admin;

import com.blade.mvc.annotation.Controller;
import com.blade.mvc.annotation.Route;
import com.blade.mvc.http.HttpMethod;
import com.blade.mvc.http.Request;
import com.blade.mvc.multipart.FileItem;
import com.blade.mvc.view.RestResponse;
import com.lzd.zimg.upload.ImgType;
import com.lzd.zimg.upload.Listener;
import com.lzd.zimg.upload.Upload;
import com.tale.exception.TipException;
import com.tale.init.TaleConst;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Collection;

/**
 * Created by lzd on 17-6-9.
 */
@Controller("admin/pic")
public class PicUploadController {
    private static final Logger LOGGER = LoggerFactory.getLogger(PicUploadController.class);

    @Route(value = "", method = HttpMethod.POST)
    @com.blade.mvc.annotation.JSON
    public synchronized RestResponse index(Request request) {
        final boolean[] success = {false};
        final String[] msg = new String[1];
        final boolean[] run = {true};
        msg[0] = "网络超时！";
        Collection<FileItem> fileItems = request.fileItems().values();
        try {
            for (FileItem fileItem : fileItems) {
                LOGGER.info("UPLOAD DIR = {}", fileItem.fileName());
                String zimgAddress = TaleConst.BCONF.get("add.zimg_address","http://127.0.0.1:4869/upload");
                Upload.postImg_s(zimgAddress, fileItem.file(), ImgType.jpg, new Listener() {
                    @Override
                    public void onSuccess(String s) {
                        LOGGER.info("success info :{}", s);
                        msg[0] = s;
                        success[0] = true;
                        run[0] = false;
                    }

                    @Override
                    public void onFild(int errorCode, String errorMsg) {
                        super.onFild(errorCode, errorMsg);
                        LOGGER.info("upload error:{}",errorMsg);
                        success[0] = false;
                        msg[0] = errorMsg;
                        run[0] = false;
                    }
                });
                while (run[0]) {
                    Thread.sleep(25);
                }
            }
        } catch (Exception e) {
            msg[0] = "文件上传失败";
            if (e instanceof TipException) {
                msg[0] = e.getMessage();
            } else {
                LOGGER.error(msg[0], e);
            }
            success[0] = false;
        } finally {
            if (success[0]) {
                return RestResponse.ok(msg[0]);
            } else {
                return RestResponse.fail(msg[0]);
            }
        }


    }
}
