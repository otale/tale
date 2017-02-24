package com.tale.service;

import com.tale.model.Users;

public interface UsersService {

    Users byId(Integer uid);

    void update(Users users);

    Users login(String username, String password);
}
