package com.tale.model;

import java.io.Serializable;
import java.util.Date;
import com.blade.jdbc.annotation.Table;

//
@Table(name = "t_relationships", pk = "mid")
public class Relationships implements Serializable {

	private static final long serialVersionUID = 1L;

	// 内容主键
	private Integer cid;

	// 项目主键
	private Integer mid;

	public Relationships(){}

	public Integer getCid() {
		return cid;
	}

	public void setCid(Integer cid) {
		this.cid = cid;
	}

	public Integer getMid() {
		return mid;
	}

	public void setMid(Integer mid) {
		this.mid = mid;
	}


}