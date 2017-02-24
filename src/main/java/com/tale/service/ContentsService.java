package com.tale.service;

import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.tale.dto.Archive;
import com.tale.model.Contents;

import java.util.List;

public interface ContentsService {

	Contents getContents(String id);

	Contents getPage(String slug);

	Paginator<Contents> getArticles(Take take);

    void publish(Contents contents);

	void update(Contents contents);

    void delete(int cid);

    Paginator<Contents> getArticles(Integer mid, int page, int limit);

    List<Archive> getArchives();

}
