/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE public.users(
    id uuid PRIMARY KEY  DEFAULT uuid_generate_v4(),
    username varchar(10) NOT NULL UNIQUE,
    password text NOT NULL,
    first_name varchar(255) NOT NULL,
    middle_name varchar(255),
    last_name varchar(255),
    created_on timestamp NOT NULL DEFAULT NOW(),
    modified_on timestamp NOT NULL DEFAULT NOW()
);

CREATE TABLE public.meals(
    id uuid PRIMARY KEY  DEFAULT uuid_generate_v4(),
    name text NOT NULL,
    calories numeric (5, 2) NOT NULL,
    created_by uuid NOT NULL,
    schedule_time timestamp NOT NULL DEFAULT NOW(),
    created_on timestamp NOT NULL DEFAULT NOW(),
    modified_by uuid NOT NULL,
    modified_on timestamp NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_user
    FOREIGN KEY(created_by)
    REFERENCES public.users(id),
    CONSTRAINT fk_user_1
    FOREIGN KEY(modified_by)
    REFERENCES public.users(id)
);