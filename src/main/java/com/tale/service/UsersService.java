package com.tale.service;

import com.blade.jdbc.core.Take;
import com.blade.jdbc.model.Paginator;
import com.tale.model.Users;

import java.util.List;

public interface UsersService {

    Users byId(Integer uid);

    List<Users> getUsersList(Take take);

    Paginator<Users> getUsersPage(Take take);

    void update(Users users) throws Exception;

    void save(Users users) throws Exception;

    void delete(Integer uid) throws Exception;

    Users login(String username, String password);
}
