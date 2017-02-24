package com.tale.service.impl;

import java.util.List;

import com.blade.ioc.annotation.Inject;
import com.blade.ioc.annotation.Service;
import com.blade.jdbc.ActiveRecord;
import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;

import com.tale.model.Relationships;
import com.tale.exception.TipException;
import com.tale.service.RelationshipsService;

@Service
public class RelationshipsServiceImpl implements RelationshipsService {

	@Inject
	private ActiveRecord activeRecord;

	@Override
	public Relationships getRelationshipsById(Integer cid) {
		if(null == cid){
			return null;
		}
		return activeRecord.byId(Relationships.class, cid);
	}

	@Override
	public List<Relationships> getRelationshipsList(Take take) {
		if(null != take){
			if(null != take.getPageRow()){
				return this.getRelationshipsPage(take).getList();
			}
			return activeRecord.list(take);
		}
		return null;
	}
	
	@Override
	public Paginator<Relationships> getRelationshipsPage(Take take) {
		if(null != take){
			return activeRecord.page(take);
		}
		return null;
	}
	
	@Override
	public void save(Relationships relationships) throws Exception {
		if(null == relationships){
			throw new TipException("对象为空");
		}
		try {
			activeRecord.insert(relationships);
		} catch (Exception e) {
			throw e;
		}
	}

	@Override
	public void update(Relationships relationships) throws Exception {
		if(null == relationships){
			throw new TipException("对象为空");
		}
		try {
			activeRecord.update(relationships);
		} catch (Exception e) {
			throw e;
		}
	}
	
	@Override
	public void delete(Integer cid) throws Exception {
		if(null == cid){
			throw new TipException("主键为空");
		}
		try {
			activeRecord.delete(Relationships.class, cid);
		} catch (Exception e){
			throw e;
		}
	}
		
}
