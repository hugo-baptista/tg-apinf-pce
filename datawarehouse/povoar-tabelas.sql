-- dim_tipo_tecnico(codigo, designacao)
insert into dim_tipo_tecnico(codigo, designacao)
select distinct code, designation
from `analises.users`;
select * from dim_tipo_tecnico;


-- dim_tecnico(id_Tipo_Tecnico, username, nome)
insert into dim_tecnico(id_Tipo_Tecnico, username, nome)
select t.id_Tipo_Tecnico, a.username, a.nome
from(
select distinct code as codigo, username, name as nome
from `analises.users`) a, dim_tipo_tecnico as t
where t.codigo=a.codigo
order by t.id_Tipo_Tecnico asc;
select * from dim_tecnico;


-- dim_paciente(num_sns, nome, genero, data_nascimento, morada)
insert into dim_paciente(num_sns, nome, genero, data_nascimento, morada)
select distinct composition->'$."items.0.0.items.0.items.0.value"' as sns,
				composition->'$."items.0.0.items.0.items.1.value"' as nome,
				composition->'$."items.0.0.items.0.items.4.value"."text"' as genero,
				composition->'$."items.0.0.items.0.items.3.items.0.value"' as data_nascimento,
				composition->'$."items.0.0.items.0.items.2.items.0.value"' as morada
from `analises.forms`;
select * from dim_paciente;


-- dim_codigo(codigo, desgincacao)
insert into dim_codigo(codigo, desgincacao)
select distinct replace(t.codigo, 'local_terms::', '') as codigo, t.designacao
from `analises.forms`,
json_table(composition, '$."items.0.1.items.1.value"[*]'
	columns (
		codigo varchar(200) path '$.code',
		designacao varchar(200) path '$.text'
	)
) as t;
select * from dim_codigo;


-- dim_tipo_procedimento(codigo, categoria)
insert into dim_tipo_procedimento(codigo, categoria)
select distinct replace(composition->'$."items.0.1.items.0.value"."code"', 'local_terms::', '') as codigo,
				composition->'$."items.0.1.items.0.value"."text"' as categoria
from `analises.forms`;
select * from dim_tipo_procedimento;


-- dim_procedimento(id_Tipo_Procedimento, conclusao)
insert into dim_procedimento(id_Tipo_Procedimento, conclusao)
select tp.id_Tipo_Procedimento, f.conclusao
from dim_tipo_procedimento as tp, (
select 	composition->'$."items.0.1.items.3.value"' as conclusao,
		replace(composition->'$."items.0.1.items.0.value"."code"', 'local_terms::', '') as codigo
from `analises.forms`) as f
where f.codigo = tp.codigo;
select * from dim_procedimento;


-- dim_codigo_has_procedimento(id_Codigo, id_Procedimento)
insert into dim_codigo_has_procedimento(id_Codigo, id_Procedimento)
select c.id_Codigo, p.id_Procedimento
from dim_codigo as c, dim_tipo_procedimento as tp, dim_procedimento as p, (
select distinct replace(t.codigo, 'local_terms::', '') as codigo,
				replace(a.composition->'$."items.0.1.items.0.value"."code"', 'local_terms::', '') as procedimento
from `analises.forms` as a,
json_table(composition, '$."items.0.1.items.1.value"[*]'
	columns (
		codigo varchar(200) path '$.code',
		designacao varchar(200) path '$.text'
	)
) as t) as r
where c.codigo=r.codigo and r.procedimento=tp.codigo and tp.id_Tipo_Procedimento=p.id_Tipo_Procedimento;
select * from dim_codigo_has_procedimento;


-- dim_tipo_observacao(codigo, metodo)
insert into dim_tipo_observacao(codigo, metodo)
select distinct replace(t.codigo, 'local_terms::', '') as codigo, t.metodo
from `analises.forms`,
json_table(composition, '$."items.0.1.items.2.value"[*]'
	columns (
		codigo varchar(200) path '$."values"."items.0.1.items.2.items.0.value"."code"',
		metodo varchar(200) path '$."values"."items.0.1.items.2.items.0.value"."text"'
	)
) as t;
select * from dim_tipo_observacao;

-- dim_observacao(id_Procedimento, id_Tecnico, id_Tipo_Observacao, data_observacao, valor, unidade)
insert into dim_observacao(id_Procedimento, id_Tecnico, id_Tipo_Observacao, data_observacao, valor, unidade)
select p.id_Procedimento, t.id_Tecnico, tob.id_Tipo_Observacao, f.data_observacao, f.valor, f.unidade
from (
	select 	replace(composition->'$."items.0.1.items.0.value"."code"', 'local_terms::', '') as procedimento,
			replace(o.observacao, 'local_terms::', '') as observacao,
            composition->'$."items.0.1.items.3.value"' as conclusao,
			o.tecnico, concat(o.dta, ' ', o.hora) as data_observacao, o.valor, o.unidade
	from `analises.forms`,
	json_table(composition, '$."items.0.1.items.2.value"[*]."values"'
		columns (
			tecnico varchar(50) path '$."items.0.1.items.2.items.3.items.1.value"',
			observacao varchar(200) path '$."items.0.1.items.2.items.0.value"."code"',
            dta date path '$."items.0.1.items.2.items.4.value.date"',
            hora time path '$."items.0.1.items.2.items.4.value.time"',
			valor varchar(50) path '$."items.0.1.items.2.items.1.value"',
            unidade varchar(50) path '$."items.0.1.items.2.items.2.value"'
		)
	) as o
) as f, dim_tipo_procedimento as tp, dim_procedimento as p, dim_tipo_observacao as tob, dim_tecnico as t
where 	tp.codigo=f.procedimento and tp.id_Tipo_Procedimento=p.id_Tipo_Procedimento and trim(f.conclusao)=trim(p.conclusao)
		and tob.codigo=f.observacao and t.username=f.tecnico;
select * from dim_observacao;


-- fact_analise(id_Paciente, id_Procedimento, id_Tecnico, id_Recetor, ativa)
insert into fact_analise(id_Paciente, id_Procedimento, id_Tecnico, id_Recetor, ativa)
select pac.id_Paciente, pro.id_Procedimento, t.id_Tecnico, f.id_Recetor, f.ativa
from(
	select sns, procedimento, conclusao, tecnico, r.id_Tecnico as id_Recetor, ativa
	from(
		select	composition->'$."items.0.0.items.0.items.0.value"' as sns,
				replace(composition->'$."items.0.1.items.0.value"."code"', 'local_terms::', '') as procedimento,
				composition->'$."items.0.1.items.3.value"' as conclusao,
				creator as tecnico,
				replace(composition->'$."items.0.1.items.5.items.1.value"', '"', '') as recetor,
				if(active='True', 1, 0) as ativa
		from `analises.forms`
    ) as o, dim_tecnico as r
    where r.username=o.recetor
) as f, dim_paciente as pac, dim_procedimento as pro, dim_tipo_procedimento as tp, dim_tecnico as t
where 	pac.num_sns=convert(f.sns, decimal) and pro.id_Tipo_Procedimento=tp.id_Tipo_Procedimento
		and trim(tp.codigo)=trim(f.procedimento) and t.username=f.tecnico and trim(f.conclusao)=trim(pro.conclusao);
select * from fact_analise;