package com.tale.utils;

import lombok.experimental.UtilityClass;

import javax.imageio.ImageIO;
import javax.imageio.ImageReadParam;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Iterator;

@UtilityClass
public class ImageUtils {

    /**
     * 根据尺寸图片居中裁剪
     *
     * @param src
     * @param dist
     * @param w
     * @param h
     * @throws IOException
     */
    public static void cutCenterImage(String src, String dist, int w, int h) throws IOException {
        String           imgExt   = src.substring(src.lastIndexOf(".") + 1);
        Iterator         iterator = ImageIO.getImageReadersByFormatName(imgExt);
        ImageReader      reader   = (ImageReader) iterator.next();
        InputStream      in       = new FileInputStream(src);
        ImageInputStream iis      = ImageIO.createImageInputStream(in);
        reader.setInput(iis, true);
        ImageReadParam param      = reader.getDefaultReadParam();
        int            imageIndex = 0;
        int            x          = (reader.getWidth(imageIndex) - w) / 2 <= 0 ? 0 : (reader.getWidth(imageIndex) - w) / 2;
        int            y          = (reader.getHeight(imageIndex) - h) / 2 <= 0 ? 0 : (reader.getHeight(imageIndex) - h) / 2;
        Rectangle      rect       = new Rectangle(x, y, w, h);
        param.setSourceRegion(rect);
        BufferedImage bi = reader.read(0, param);
        ImageIO.write(bi, imgExt, new File(dist));

    }

}
