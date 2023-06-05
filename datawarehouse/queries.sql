-- Ver evolução das análises dos pacientes
select 	concat(pac.nome, ' (', pac.num_sns, ')') as 'Paciente', pac.genero as 'Género',
		concat('(', tp.codigo, ') ', tp.categoria) as 'Procedimento', concat('(', tob.codigo, ') ', tob.metodo) as 'Observação',
        concat(ob.valor, ' ', ob.unidade) as 'Valor',  ob.data_observacao as 'Data', pro.conclusao as 'Conclusão'
from 	dim_paciente as pac, fact_analise as a, dim_procedimento as pro, dim_tipo_procedimento as tp, dim_observacao as ob,
		dim_tipo_observacao tob
where	a.ativa=1 and pac.id_Paciente=a.id_Paciente and a.id_Procedimento=pro.id_Procedimento
		and pro.id_Tipo_Procedimento=tp.id_Tipo_Procedimento and pro.id_Procedimento=ob.id_Procedimento
        and ob.id_Tipo_Observacao=tob.id_Tipo_Observacao
order by pac.num_sns, tp.codigo, tob.codigo, ob.data_observacao asc;

-- Análises criadas pelos técnicos
select	concat(tec.nome, ' (', tec.username, ')') as 'Técnico', concat(pac.nome, ' (', pac.num_sns, ')') as 'Paciente',
		pac.genero as 'Género', concat('(', tp.codigo, ') ', tp.categoria) as 'Procedimento',
        concat('(', c.codigo, ') ', c.desgincacao) as 'Procedimento'
from 	dim_tecnico as tec, fact_analise as a, dim_paciente as pac, dim_procedimento as pro, dim_tipo_procedimento as tp,
		dim_codigo_has_procedimento as cp, dim_codigo as c
where	a.ativa=1 and tec.id_Tecnico=a.id_Tecnico and a.id_Paciente=pac.id_Paciente
		and a.id_Procedimento=pro.id_Procedimento and pro.id_Tipo_Procedimento=tp.id_Tipo_Procedimento
        and pro.id_Procedimento=cp.id_Procedimento and cp.id_Codigo=c.id_Codigo
order by tec.username, pac.num_sns, tp.codigo, c.codigo asc;

-- Análises pelos seus recetores
select	concat(tec.nome, ' (', tec.username, ')') as 'Recetor', concat(pac.nome, ' (', pac.num_sns, ')') as 'Paciente',
		pac.genero as 'Género', concat('(', tp.codigo, ') ', tp.categoria) as 'Procedimento',
        concat('(', c.codigo, ') ', c.desgincacao) as 'Código'
from 	dim_tecnico as tec, fact_analise as a, dim_paciente as pac, dim_procedimento as pro, dim_tipo_procedimento as tp,
		dim_codigo_has_procedimento as cp, dim_codigo as c
where	a.ativa=1 and tec.id_Tecnico=a.id_Recetor and a.id_Paciente=pac.id_Paciente
		and a.id_Procedimento=pro.id_Procedimento and pro.id_Tipo_Procedimento=tp.id_Tipo_Procedimento
        and pro.id_Procedimento=cp.id_Procedimento and cp.id_Codigo=c.id_Codigo
order by tec.username, pac.num_sns, tp.codigo, c.codigo asc;

-- Observações criadas pelos técnicos
select	concat(tec.nome, ' (', tec.username, ')') as 'Técnico', concat(pac.nome, ' (', pac.num_sns, ')') as 'Paciente',
		pac.genero as 'Género', concat('(', tp.codigo, ') ', tp.categoria) as 'Procedimento',
        concat('(', tob.codigo, ') ', tob.metodo) as 'Observação', concat(ob.valor, ' ', ob.unidade) as 'Valor',
        ob.data_observacao as 'Data', pro.conclusao as 'Conclusão'
from 	dim_tecnico as tec, dim_observacao as ob, dim_tipo_observacao as tob, dim_procedimento as pro,
		dim_tipo_procedimento as tp, fact_analise as a, dim_paciente as pac
where	a.ativa=1 and tec.id_Tecnico=ob.id_Tecnico and ob.id_Tipo_Observacao=tob.id_Tipo_Observacao
		and ob.id_Procedimento=pro.id_Procedimento and pro.id_Tipo_Procedimento=tp.id_Tipo_Procedimento
        and pro.id_Procedimento=a.id_Procedimento and a.id_Paciente=pac.id_Paciente
order by tec.username, pac.num_sns, tp.codigo, tob.codigo, ob.data_observacao asc;
        
-- Observações pelos seus recetores
select	concat(tec.nome, ' (', tec.username, ')') as 'Recetor', concat(pac.nome, ' (', pac.num_sns, ')') as 'Paciente',
		pac.genero as 'Género', concat('(', tp.codigo, ') ', tp.categoria) as 'Procedimento',
        concat('(', tob.codigo, ') ', tob.metodo) as 'Observação', concat(ob.valor, ' ', ob.unidade) as 'Valor',
        ob.data_observacao as 'Data', pro.conclusao as 'Conclusão'
from 	dim_paciente as pac, fact_analise as a, dim_tecnico as tec, dim_procedimento as pro, dim_tipo_procedimento as tp,
		dim_observacao as ob, dim_tipo_observacao as tob
where	pac.id_Paciente=a.id_Paciente and a.id_Recetor=tec.id_Tecnico and a.id_Procedimento=pro.id_Procedimento
		and pro.id_Tipo_Procedimento=tp.id_Tipo_Procedimento and pro.id_Procedimento=ob.id_Procedimento
        and ob.id_Tipo_Observacao=tob.id_Tipo_Observacao
order by tec.username, pac.num_sns, tp.codigo, tob.codigo, ob.data_observacao;