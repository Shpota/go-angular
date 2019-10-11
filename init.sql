create sequence students_id_seq
    as integer;

create table students
(
    id   serial not null constraint students_pkey primary key,
    name text,
    age  integer
);
