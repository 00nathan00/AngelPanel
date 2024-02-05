module.exports.details = {
    name: "skins",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
-- \\\\\\\\\\\\ skins //////////// 


local tabl = {"cw_ak74","cw_ar15","cw_vss","cw_mr96","cw_mp5","cw_mp7_official","cw_deagle","cw_l115","cw_m14","cw_m3super90","cw_p99","cw_g18","cw_g3a3"}
local skinss = {"aucun","banana","gold","citywhite","clearsky","desert","erdl","fade","flek","german","gorka","jungle","multicam","pinkddpat","russia","ruswood","shit","snake","urban","vega","woodland","aqua","atacs","bacon","blackhole","blackops","blitz","bloodshot","blue_wave","breach","burn","comic","coyote","craze","dark_matter","dark_pulse","dayofdead","der_riese","devgru","diamond","digital","dollars","dragon","elite","elite_ghost","epilepsy","flectarn","flora","ghost","gold_matter","graffiti","greenscreen","holo","kawai","mango","massacre","ripple","ronin","sahara","stars","static","tiger_blue","tiger_jungle","urban","weed","wired","woodland","zebra"}


steamworks.DownloadUGC( "3082424643", function( path )
	game.MountGMA( path )
end)
for i = 1,13 do 
    table.insert(skinss,"awm_"..i)

end

surface.CreateFont( "APSansation15", {
    font = "Sansation",
    extended = false,
    size = ScreenScale( 6 ),
    weight = 500,
})

local t = emodules.new()

t.name = "Skins"
t.desc = "Permet de mettre des skins sur vos armes"

function t:onStart()
    hook.Add('PostDrawViewModel',"AngelPanel:SetSkins",function (entt)
        local wep = LocalPlayer():GetActiveWeapon()

        if not wep.CW_VM then return end
        local skins = emodules:getmconfig("Skins","skins")
        local weaponskin = skins[wep:GetClass()]
        if not weaponskin then return end
        if weaponskin == wep.CW_VM.ap_skin then return end

        wep.CW_VM.ap_skin = weaponskin

        for k ,v in ipairs(entt:GetMaterials()) do 
            if string.find( v, "hands" ) then  continue end 
            wep.CW_VM:SetSubMaterial(k-1,"skins/"..weaponskin)
        end  
        ::next::
    end)

end
function t:onStop()
    hook.Remove('PostDrawViewModel',"AngelPanel:SetSkins")
    for k,v in ipairs(LocalPlayer():GetWeapons()) do 
        if not v.CW_VM then goto next end

        v:createCustomVM(v.CW_VM:GetModel())
        ::next::
    end
end
t:addConfig("skins",{
    defvalue = {}
})





t:addConfig("managskins",{
    name = "Gérer les skins",
    desc = "Permet d'ouvrir le menu pour gerer les skins d'armes",
    vgui = "DButton",
    text = "Ouvrir",
    callback = function()
        if not emodules:getmactive("Skins") then return end
        local window = SimpleRP.createWindow()
        window:SetSize(ScrW()*0.6, ScrH()*0.85)
        window:Center()
        window:SetBlur(false)

        window:addBottomButton("FERMER", function()
            window:Remove()
        end)

        window:addTab("Skins", "materials/simpleroleplay/vgui/package.png", function(panel)

        local function initpanel()

            local List = vgui.Create( "DIconLayout", panel )
            List:Dock( FILL )
            List:SetSpaceY( 5 ) 
            List:SetSpaceX( 5 ) 
            
        
            for k ,v in ipairs(tabl) do 
                local slot = List:Add( "DPanel" ) 
                slot:SetSize( ScrW()*0.1, ScrH()*0.1 )
                function  slot:Paint(w,h)
                    draw.RoundedBox(0,0,0,w,h,Color(112,107,107,110))
                    draw.RoundedBox(0,0,h*0.7,w,h,Color(41,39,39,110))
                    draw.SimpleText(weapons.Get( v ).PrintName,"APSansation15",w/2,h*0.8,color_white,TEXT_ALIGN_CENTER,TEXT_ALIGN_CENTER)
                end

            
                local model = vgui.Create( "DModelPanel", slot )
                model:Dock(FILL)
                model:SetModel(weapons.Get( v ).WorldModel or "")
                function model:LayoutEntity( Entity ) return end
                local min, max = model.Entity:GetRenderBounds()
                model:SetCamPos( Vector( 20, 30, 0 )  )
                model:SetLookAt( ( min + max ) / 2 )
                local skins = emodules:getmconfig("Skins","skins")
                local weaponskin = skins[v]
                if  weaponskin then 
                    model.Entity:SetSubMaterial(0,"skins/"..weaponskin)
                end
                
                local click = vgui.Create( "DButton", slot ) 
                click:SetSize( slot:GetWide(),ScrH()*0.1)
                click:SetText( "" )									
                click.Paint = nil

                click.DoClick = function()				
                    List:Clear()	
                
                    local Panel = vgui.Create( "DPanel",panel )
                    Panel:SetSize(ScrW()*0.4,ScrH()*0.2)
                    Panel:SetPos(panel:GetWide()/2-Panel:GetWide()/2,50)
                    Panel.Paint = nil

                    local model = vgui.Create( "DModelPanel", Panel )
                    model:SetSize(Panel:GetWide(),Panel:GetTall())
                    model:SetModel( weapons.Get( v ).WorldModel or "")
                    function model:LayoutEntity( Entity ) return end
                    local min, max = model.Entity:GetRenderBounds()
                    model:SetCamPos( Vector( 1, 1, 1 ) * min:Distance( max ) )
                    model:SetLookAt( ( min + max ) / 2 )       
                    local skins = emodules:getmconfig("Skins","skins")
                    local weaponskin = skins[v]
                    if  weaponskin then 
                        model.Entity:SetSubMaterial(0,"skins/"..weaponskin)
                    end

                    
                    local Scroll = vgui.Create( "DScrollPanel", panel ) 
                    Scroll:Dock( FILL )
                    Scroll:DockMargin(0,ScrH()*0.3,0,0)

                    local lists = vgui.Create( "DIconLayout", Scroll )
                    lists:Dock( FILL )
                    lists:SetSpaceY( 5 ) 
                    lists:SetSpaceX( 5 ) 

                    local btn = panel.addButton(panel)
                    btn:SetText("Retour")
                    btn:Dock(BOTTOM)
                    btn:SetTall(ScrH()*0.02)
                    btn:DockMargin(ScrW()*0.5,0,0,ScrH()*0.001)

                    function btn:DoClick()
                        lists:Remove()
                        model:Remove()
                        initpanel() 
                        self:Remove()
                    end

                    
                    for kk,vv in pairs(skinss) do 
                        local skinslot = lists:Add( "DPanel" ) 
                        skinslot:SetSize( ScrW()*0.05, ScrH()*0.05 )
                        function  skinslot:Paint(w,h)
                            draw.RoundedBox(0,0,0,w,h,Color(112,107,107,110))
                            draw.SimpleText(vv,"APSansation15",w/2,h/2,color_white,TEXT_ALIGN_CENTER,TEXT_ALIGN_CENTER)

                        end
                        local selectbtn = vgui.Create( "DButton", skinslot ) 
                        selectbtn:SetText( "" )										
                        selectbtn:SetSize( skinslot:GetWide(),skinslot:GetTall() )
                        selectbtn.Paint = nil
                
                        selectbtn.DoClick = function()
                            model.Entity:SetSubMaterial(0,"skins/"..vv)	

                            local skins =  emodules:getmconfig("Skins","skins")
                            skins[v] = vv
                            emodules:setmconfig("Skins","skins",skins)

                        end
                    end
                end
            end
        end
        initpanel()
        end)   
    end
})
t:End()

`