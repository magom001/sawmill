--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.10
-- Dumped by pg_dump version 9.5.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: factory; Type: SCHEMA; Schema: -; Owner: magom001
--

CREATE SCHEMA factory;


ALTER SCHEMA factory OWNER TO magom001;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA factory;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: tablefunc; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS tablefunc WITH SCHEMA factory;


--
-- Name: EXTENSION tablefunc; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION tablefunc IS 'functions that manipulate whole tables, including crosstab';


SET search_path = factory, pg_catalog;

--
-- Name: assign_docnum(integer, integer); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION assign_docnum(doctype integer, docyear integer) RETURNS integer
    LANGUAGE plpgsql
    AS $_$
declare
newdocnum integer;
begin
select coalesce(max(doc.docnum),0)+1 into newdocnum from factory.document doc where doc.doctype = $1 and doc.docyear = $2;
return newdocnum;
end;
$_$;


ALTER FUNCTION factory.assign_docnum(doctype integer, docyear integer) OWNER TO magom001;

--
-- Name: create_new_stack(integer, integer, integer, integer, text, integer, integer, integer, integer); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION create_new_stack(fdoctype integer, fdocnum integer, fdocyear integer, fwh integer, fstackid text, fspeciesid integer, fdimensionid integer, flengthid integer, fquantity integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
begin
insert into factory.stack(id, speciesid, dimensionid, lengthid) values(fstackid, fspeciesid, fdimensionid, flengthid);
insert into factory.docdetail(doctype, docyear, docnum, wh, stackid, quantity) values (fdoctype, fdocyear, fdocnum,fwh,fstackid, fquantity);
exception
when unique_violation then
raise exception 'Повторяющийся номер штабеля: %', fstackid;

end; $$;


ALTER FUNCTION factory.create_new_stack(fdoctype integer, fdocnum integer, fdocyear integer, fwh integer, fstackid text, fspeciesid integer, fdimensionid integer, flengthid integer, fquantity integer) OWNER TO magom001;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: document; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE document (
    doctype integer NOT NULL,
    docyear integer NOT NULL,
    docnum integer NOT NULL,
    docdate date DEFAULT now(),
    wh integer NOT NULL,
    commentary text,
    doctype_ref integer,
    docyear_ref integer,
    docnum_ref integer,
    wh_ref integer,
    employee integer DEFAULT 1 NOT NULL,
    docmonth integer
);


ALTER TABLE document OWNER TO magom001;

--
-- Name: move_stack_document(integer, integer, integer, integer, integer, date); Type: FUNCTION; Schema: factory; Owner: postgres
--

CREATE FUNCTION move_stack_document(doctype integer, from_wh integer, to_wh integer, year integer, e integer, dd date) RETURNS document
    LANGUAGE plpgsql
    AS $_$
declare
tmp factory.document%rowtype;
begin
insert into factory.document(doctype, docyear, wh, employee, docdate) values (2, $4, from_wh, e,dd) returning * into tmp;
insert into factory.document(doctype, docyear,wh,doctype_ref,docyear_ref,docnum_ref,wh_ref, employee, docdate) values ($1,$4, to_wh,tmp.doctype,tmp.docyear, tmp.docnum, tmp.wh, e, dd) returning * into tmp;
return tmp;
end;$_$;


ALTER FUNCTION factory.move_stack_document(doctype integer, from_wh integer, to_wh integer, year integer, e integer, dd date) OWNER TO postgres;

--
-- Name: docdetail; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE docdetail (
    doctype integer NOT NULL,
    docyear integer NOT NULL,
    docnum integer NOT NULL,
    stackid text NOT NULL,
    wh integer NOT NULL,
    quantity integer NOT NULL
);


ALTER TABLE docdetail OWNER TO magom001;

--
-- Name: move_stock_docdetail(integer, integer, integer, text, integer); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION move_stock_docdetail(doctype integer, docyear integer, docnum integer, stack text, quantity integer) RETURNS docdetail
    LANGUAGE plpgsql
    AS $_$
declare
doc factory.document%rowtype;
dd factory.docdetail%rowtype;
begin
select * into doc from factory.document document where document.doctype=$1 and document.docyear = $2 and document.docnum=$3;
if not found then
raise exception 'Документ не найден';
end if;
insert into factory.docdetail(doctype, docyear, docnum, wh, stackid, quantity) values(doc.doctype_ref, doc.docyear_ref, doc.docnum_ref, doc.wh_ref, stack, quantity);
insert into factory.docdetail(doctype, docyear, docnum, wh, stackid, quantity) values(doc.doctype, doc.docyear, doc.docnum, doc.wh, stack, quantity) returning * into dd;
return dd;
end;$_$;


ALTER FUNCTION factory.move_stock_docdetail(doctype integer, docyear integer, docnum integer, stack text, quantity integer) OWNER TO magom001;

--
-- Name: trg_extract_month(); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION trg_extract_month() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
new.docmonth = extract(month from new.docdate);
return new;
end;
$$;


ALTER FUNCTION factory.trg_extract_month() OWNER TO magom001;

--
-- Name: trigger_assign_docnum(); Type: FUNCTION; Schema: factory; Owner: magom001
--

CREATE FUNCTION trigger_assign_docnum() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
new.docnum :=factory.assign_docnum(new.doctype, new.docyear);
return new;
end;
$$;


ALTER FUNCTION factory.trigger_assign_docnum() OWNER TO magom001;

--
-- Name: dimension; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE dimension (
    id integer NOT NULL,
    thickness_mm integer NOT NULL,
    width_mm integer NOT NULL
);


ALTER TABLE dimension OWNER TO magom001;

--
-- Name: dimension_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE dimension_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE dimension_id_seq OWNER TO magom001;

--
-- Name: dimension_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE dimension_id_seq OWNED BY dimension.id;


--
-- Name: doctype; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE doctype (
    id integer NOT NULL,
    docname text NOT NULL,
    docsign integer NOT NULL,
    category text
);


ALTER TABLE doctype OWNER TO magom001;

--
-- Name: doctype_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE doctype_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE doctype_id_seq OWNER TO magom001;

--
-- Name: doctype_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE doctype_id_seq OWNED BY doctype.id;


--
-- Name: documents_employees; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE documents_employees (
    doctype integer NOT NULL,
    docyear integer NOT NULL,
    docnum integer NOT NULL,
    wh integer NOT NULL,
    employee integer NOT NULL,
    hours numeric,
    CONSTRAINT documents_employees_hours_check CHECK ((hours <= (12)::numeric))
);


ALTER TABLE documents_employees OWNER TO magom001;

--
-- Name: warehouse; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE warehouse (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE warehouse OWNER TO magom001;

--
-- Name: documents_view; Type: VIEW; Schema: factory; Owner: magom001
--

CREATE VIEW documents_view AS
 SELECT doc.doctype,
    dt.category,
    dt.docname,
    doc.docnum,
    doc.docyear,
    doc.docmonth,
    doc.docdate,
    doc.wh,
    wh1.name AS warehouse,
    doc.wh_ref,
    wh2.name AS warehouse_ref
   FROM (((document doc
     JOIN doctype dt ON ((doc.doctype = dt.id)))
     JOIN warehouse wh1 ON ((doc.wh = wh1.id)))
     LEFT JOIN warehouse wh2 ON ((doc.wh_ref = wh2.id)));


ALTER TABLE documents_view OWNER TO magom001;

--
-- Name: employee; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE employee (
    id integer NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL,
    profession text NOT NULL,
    employedfrom date NOT NULL,
    employedtill date,
    middlename text
);


ALTER TABLE employee OWNER TO magom001;

--
-- Name: employee_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE employee_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE employee_id_seq OWNER TO magom001;

--
-- Name: employee_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE employee_id_seq OWNED BY employee.id;


--
-- Name: length; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE length (
    id integer NOT NULL,
    length_mm integer NOT NULL
);


ALTER TABLE length OWNER TO magom001;

--
-- Name: length_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE length_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE length_id_seq OWNER TO magom001;

--
-- Name: length_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE length_id_seq OWNED BY length.id;


--
-- Name: species; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE species (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE species OWNER TO magom001;

--
-- Name: species_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE species_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE species_id_seq OWNER TO magom001;

--
-- Name: species_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE species_id_seq OWNED BY species.id;


--
-- Name: stack; Type: TABLE; Schema: factory; Owner: magom001
--

CREATE TABLE stack (
    id text NOT NULL,
    speciesid integer,
    dimensionid integer,
    lengthid integer,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE stack OWNER TO magom001;

--
-- Name: stacks_list_view; Type: VIEW; Schema: factory; Owner: magom001
--

CREATE VIEW stacks_list_view AS
 SELECT stack.id,
    species.name AS species,
    concat(dimension.thickness_mm, 'x', dimension.width_mm, 'x', length.length_mm) AS size
   FROM (((stack
     JOIN dimension ON ((stack.dimensionid = dimension.id)))
     JOIN species ON ((stack.speciesid = species.id)))
     JOIN length ON ((stack.lengthid = length.id)));


ALTER TABLE stacks_list_view OWNER TO magom001;

--
-- Name: stock_view; Type: VIEW; Schema: factory; Owner: magom001
--

CREATE VIEW stock_view AS
 SELECT dd.stackid,
    dd.wh,
    warehouse.name,
    s.species,
    s.size,
    sum((dd.quantity * dt.docsign)) AS quantity
   FROM (((docdetail dd
     JOIN doctype dt ON ((dd.doctype = dt.id)))
     JOIN stacks_list_view s ON ((s.id = dd.stackid)))
     JOIN warehouse ON ((warehouse.id = dd.wh)))
  GROUP BY dd.stackid, dd.wh, warehouse.name, s.species, s.size
 HAVING (sum((dd.quantity * dt.docsign)) > 0);


ALTER TABLE stock_view OWNER TO magom001;

--
-- Name: stock_by_spec_view; Type: VIEW; Schema: factory; Owner: magom001
--

CREATE VIEW stock_by_spec_view AS
 SELECT concat(stock_view.species, ' ', stock_view.size) AS specification,
    stock_view.wh,
    stock_view.name,
    sum(stock_view.quantity) AS sum
   FROM stock_view
  GROUP BY (concat(stock_view.species, ' ', stock_view.size)), stock_view.wh, stock_view.name;


ALTER TABLE stock_by_spec_view OWNER TO magom001;

--
-- Name: warehouse_id_seq; Type: SEQUENCE; Schema: factory; Owner: magom001
--

CREATE SEQUENCE warehouse_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE warehouse_id_seq OWNER TO magom001;

--
-- Name: warehouse_id_seq; Type: SEQUENCE OWNED BY; Schema: factory; Owner: magom001
--

ALTER SEQUENCE warehouse_id_seq OWNED BY warehouse.id;


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY dimension ALTER COLUMN id SET DEFAULT nextval('dimension_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY doctype ALTER COLUMN id SET DEFAULT nextval('doctype_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY employee ALTER COLUMN id SET DEFAULT nextval('employee_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY length ALTER COLUMN id SET DEFAULT nextval('length_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY species ALTER COLUMN id SET DEFAULT nextval('species_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY warehouse ALTER COLUMN id SET DEFAULT nextval('warehouse_id_seq'::regclass);


--
-- Data for Name: dimension; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY dimension (id, thickness_mm, width_mm) FROM stdin;
1	30	100
2	30	125
3	30	150
4	14	72
5	19	100
6	22	100
7	30	175
8	30	200
9	63	150
10	63	175
11	63	200
\.


--
-- Name: dimension_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('dimension_id_seq', 11, true);


--
-- Data for Name: docdetail; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY docdetail (doctype, docyear, docnum, stackid, wh, quantity) FROM stdin;
1	2017	1	202050	1	434
1	2017	1	202051	1	434
1	2017	1	202052	1	434
1	2017	1	202053	1	434
1	2017	1	202054	1	434
1	2017	1	202055	1	434
1	2017	1	202056	1	434
1	2017	1	202057	1	434
1	2017	1	202058	1	434
1	2017	1	202059	1	434
1	2017	1	202060	1	434
1	2017	1	202061	1	434
1	2017	1	202062	1	434
1	2017	1	202063	1	434
1	2017	1	202064	1	434
1	2017	1	202065	1	434
1	2017	1	202066	1	431
1	2017	1	202067	1	200
1	2017	2	202104	1	180
1	2017	2	202105	1	180
1	2017	2	202106	1	180
1	2017	2	202107	1	180
1	2017	2	202109	1	527
1	2017	2	202110	1	527
1	2017	2	202111	1	527
1	2017	2	202112	1	527
1	2017	2	202113	1	527
1	2017	2	202114	1	527
1	2017	2	202115	1	527
1	2017	2	202108	1	195
2	2017	1	202108	1	195
\.


--
-- Data for Name: doctype; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY doctype (id, docname, docsign, category) FROM stdin;
3	Оприходование сушильных штабелей	1	\N
1	Выпуск штабелей от ШФМ	1	выпуск
4	Выпуск штабелей от ручной раскладки	1	выпуск
5	Загрузка сушильной камеры	1	перемещение
2	Списание сушильных штабелей	-1	
6	Списание на линию сортировки	-1	списание
\.


--
-- Name: doctype_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('doctype_id_seq', 6, true);


--
-- Data for Name: document; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY document (doctype, docyear, docnum, docdate, wh, commentary, doctype_ref, docyear_ref, docnum_ref, wh_ref, employee, docmonth) FROM stdin;
1	2017	1	2017-12-06	1	\N	\N	\N	\N	\N	3	12
2	2017	1	2017-12-08	1	\N	\N	\N	\N	\N	1	12
1	2017	2	2017-12-11	1	\N	\N	\N	\N	\N	4	12
2	2017	2	2017-12-12	1	\N	\N	\N	\N	\N	1	12
5	2017	1	2017-12-12	2	\N	2	2017	2	1	1	12
\.


--
-- Data for Name: documents_employees; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY documents_employees (doctype, docyear, docnum, wh, employee, hours) FROM stdin;
\.


--
-- Data for Name: employee; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY employee (id, firstname, lastname, profession, employedfrom, employedtill, middlename) FROM stdin;
1	Иван	Иванов	станочник	2017-05-01	\N	Иванович
3	Александр	Бутаков	мастер цеха	2017-08-01	\N	Николаевич
4	Дмитрий	Сластихин	мастер цеха	2017-08-01	\N	Владимирович
\.


--
-- Name: employee_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('employee_id_seq', 4, true);


--
-- Data for Name: length; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY length (id, length_mm) FROM stdin;
1	4000
2	6000
\.


--
-- Name: length_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('length_id_seq', 2, true);


--
-- Data for Name: species; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY species (id, name) FROM stdin;
1	Ель обыкновенная
2	Сосна обыкновенная
\.


--
-- Name: species_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('species_id_seq', 2, true);


--
-- Data for Name: stack; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY stack (id, speciesid, dimensionid, lengthid, created_at) FROM stdin;
202050	1	2	1	2017-12-07 19:13:46.755209
202051	1	2	1	2017-12-07 19:17:43.003264
202052	1	2	1	2017-12-07 19:20:59.249879
202053	1	2	1	2017-12-07 19:21:38.881299
202054	1	2	1	2017-12-07 19:21:46.367291
202055	1	2	1	2017-12-07 19:21:49.817433
202056	1	2	1	2017-12-07 19:21:55.528851
202057	1	2	1	2017-12-07 19:21:59.862282
202058	1	2	1	2017-12-07 19:22:02.857528
202059	1	2	1	2017-12-07 19:22:09.62895
202060	1	2	1	2017-12-07 19:22:13.949784
202061	1	2	1	2017-12-07 19:22:20.39299
202062	1	2	1	2017-12-07 19:22:24.605636
202063	1	2	1	2017-12-07 19:22:34.834342
202064	1	2	1	2017-12-07 19:22:39.085861
202065	1	2	1	2017-12-07 19:22:45.616827
202066	1	2	1	2017-12-07 19:23:25.002998
202067	1	10	1	2017-12-07 19:28:21.494028
202104	1	11	1	2017-12-12 09:45:37.759434
202105	1	11	1	2017-12-12 09:45:48.578504
202106	1	11	1	2017-12-12 09:45:51.228609
202107	1	11	1	2017-12-12 09:45:53.126895
202108	1	11	1	2017-12-12 09:45:55.020684
202109	1	1	1	2017-12-12 09:46:24.206688
202110	1	1	1	2017-12-12 09:46:30.295476
202111	1	1	1	2017-12-12 09:46:34.548997
202112	1	1	1	2017-12-12 09:46:35.706384
202113	1	1	1	2017-12-12 09:46:36.717545
202114	1	1	1	2017-12-12 09:46:39.380002
202115	1	1	1	2017-12-12 09:46:40.31013
\.


--
-- Data for Name: warehouse; Type: TABLE DATA; Schema: factory; Owner: magom001
--

COPY warehouse (id, name) FROM stdin;
1	Склад сырого полуфабриката
2	Сушильная камера № 1
3	Сушильная камера № 2
\.


--
-- Name: warehouse_id_seq; Type: SEQUENCE SET; Schema: factory; Owner: magom001
--

SELECT pg_catalog.setval('warehouse_id_seq', 3, true);


--
-- Name: dimension_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY dimension
    ADD CONSTRAINT dimension_pkey PRIMARY KEY (id);


--
-- Name: doctype_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY doctype
    ADD CONSTRAINT doctype_pkey PRIMARY KEY (id);


--
-- Name: employee_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY employee
    ADD CONSTRAINT employee_pkey PRIMARY KEY (id);


--
-- Name: length_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY length
    ADD CONSTRAINT length_pkey PRIMARY KEY (id);


--
-- Name: pk_docdetail; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY docdetail
    ADD CONSTRAINT pk_docdetail PRIMARY KEY (doctype, docyear, docnum, stackid);


--
-- Name: pk_document; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT pk_document PRIMARY KEY (doctype, docnum, docyear, wh);


--
-- Name: species_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY species
    ADD CONSTRAINT species_pkey PRIMARY KEY (id);


--
-- Name: stack_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY stack
    ADD CONSTRAINT stack_pkey PRIMARY KEY (id);


--
-- Name: u_dimension; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY dimension
    ADD CONSTRAINT u_dimension UNIQUE (thickness_mm, width_mm);


--
-- Name: warehouse_pkey; Type: CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY warehouse
    ADD CONSTRAINT warehouse_pkey PRIMARY KEY (id);


--
-- Name: trg_biu_document_month; Type: TRIGGER; Schema: factory; Owner: magom001
--

CREATE TRIGGER trg_biu_document_month BEFORE INSERT OR UPDATE ON document FOR EACH ROW EXECUTE PROCEDURE trg_extract_month();


--
-- Name: trg_row_bi_document; Type: TRIGGER; Schema: factory; Owner: magom001
--

CREATE TRIGGER trg_row_bi_document BEFORE INSERT ON document FOR EACH ROW EXECUTE PROCEDURE trigger_assign_docnum();


--
-- Name: document_doctype_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT document_doctype_fkey FOREIGN KEY (doctype) REFERENCES doctype(id);


--
-- Name: document_employee_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT document_employee_fkey FOREIGN KEY (employee) REFERENCES employee(id);


--
-- Name: document_wh_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT document_wh_fkey FOREIGN KEY (wh) REFERENCES warehouse(id);


--
-- Name: fk_de_documents; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY documents_employees
    ADD CONSTRAINT fk_de_documents FOREIGN KEY (doctype, docyear, docnum, wh) REFERENCES document(doctype, docyear, docnum, wh);


--
-- Name: fk_de_employee; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY documents_employees
    ADD CONSTRAINT fk_de_employee FOREIGN KEY (employee) REFERENCES employee(id);


--
-- Name: fk_docdetail_document; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY docdetail
    ADD CONSTRAINT fk_docdetail_document FOREIGN KEY (docnum, doctype, docyear, wh) REFERENCES document(docnum, doctype, docyear, wh);


--
-- Name: fk_docdetail_stack; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY docdetail
    ADD CONSTRAINT fk_docdetail_stack FOREIGN KEY (stackid) REFERENCES stack(id);


--
-- Name: fk_document_document; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT fk_document_document FOREIGN KEY (doctype_ref, docyear_ref, docnum_ref, wh_ref) REFERENCES document(doctype, docyear, docnum, wh);


--
-- Name: fk_document_wh_ref; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY document
    ADD CONSTRAINT fk_document_wh_ref FOREIGN KEY (wh_ref) REFERENCES warehouse(id);


--
-- Name: stack_dimensionid_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY stack
    ADD CONSTRAINT stack_dimensionid_fkey FOREIGN KEY (dimensionid) REFERENCES dimension(id);


--
-- Name: stack_lengthid_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY stack
    ADD CONSTRAINT stack_lengthid_fkey FOREIGN KEY (lengthid) REFERENCES length(id);


--
-- Name: stack_speciesid_fkey; Type: FK CONSTRAINT; Schema: factory; Owner: magom001
--

ALTER TABLE ONLY stack
    ADD CONSTRAINT stack_speciesid_fkey FOREIGN KEY (speciesid) REFERENCES species(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

