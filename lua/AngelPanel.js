module.exports.details = {
    name: "AngelPanel",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: "Panel contenant tous les modules d'Angel Industries"
}

module.exports.codegen = () => `

surface.CreateFont( "APSansation30", {
	font = "Sansation",
	extended = false,
	size = ScreenScale( 8 ),
	weight = 500,
})
surface.CreateFont( "APSansation13", {
	font = "Sansation",
	extended = false,
	size = ScreenScale( 4.2 ),
	weight = 500,
})

-- create toggle button
local BUTTON = {}

function BUTTON:Init()

    self:SetText("")

    self.pos = 0
    self.click = false
end

function BUTTON:DoClick()
    self.click = not self.click

    self:OnValueChanged(self.click)
end
function BUTTON:OnValueChanged()
end
function BUTTON:GetValue()
    return self.click
end
function BUTTON:SetValue(click)
        self.click = click
end
function BUTTON:Paint(w, h)
    draw.RoundedBox(32,0,0,w,h,SimpleRP.config.gui.colors.defaultPanel) 
    if self.click then 
        self.pos = Lerp(FrameTime()*5,self.pos,w-self:GetWide()/2)
    else
        self.pos = Lerp(FrameTime()*5,self.pos,0)
    end
    draw.RoundedBox(32, self.pos,0,w-self.pos,h,Color(252,2,2))

    draw.RoundedBox(32,0,0,self.pos+h ,h,Color(6,240,26))
    draw.RoundedBox(32,self.pos,0,h,h,color_white)
end
derma.DefineControl("ToggleBtn", "Un simple bouton", BUTTON, "DButton")
-- create folder and files
if not file.IsDir( "emodules", "DATA") then 
    file.CreateDir("emodules")
end
if not file.Exists("emodules/modules.json","DATA") then 
    file.Write("emodules/modules.json","{}")
 end
 if not file.Exists("emodules/config.json","DATA") then 
    file.Write("emodules/config.json",util.TableToJSON({startonboot=true,key=KEY_T}))
 end


emodules =  emodules or {modules = {}}
local gconfig = util.JSONToTable(file.Read("emodules/config.json","DATA")) 
local config = util.JSONToTable(file.Read("emodules/modules.json","DATA")) 

-- write general config
local function refreshgconf() 
    file.Write("emodules/config.json",util.TableToJSON(gconfig))
end
-- write modules config
local function refreshconf() 
    file.Write("emodules/modules.json",util.TableToJSON(config))
end
-- get specific config of module (name of module:string, id of config:string)
function emodules:getmconfig(mod,conf)
    if not config[mod] then return end 

    return config[mod].config[conf] or false
end

-- set specific config of module (name of module:string,id of config:string, value of config:string)
function  emodules:setmconfig(mod,conf,value)
    if not config[mod] then return end

    config[mod].config[conf] = value 
    refreshconf()
end
-- disable or enable a module (name of module:string, disable or enable:bool)
function emodules:setmactive(modul,active)
    if not emodules.modules[modul] then return end 
    if not config[modul] then return end 

    config[modul].active = active

    refreshconf()

    if active then 
        if emodules.modules[modul].onStart then emodules.modules[modul].onStart() end 
    else
        if emodules.modules[modul].onStop then emodules.modules[modul].onStop() end 
    end

end
-- get if module is active or not (name of module:string){status of module:bool}
function emodules:getmactive(modul)
    if not config[modul] then return end 

    return config[modul].active
end
--set if module is favori
function emodules:SetModuleFavoris(modul,favori)
    if not config[modul] then return end 

    config[modul].favori = favori
    refreshconf()
end
-- get if module if favori
function emodules:IsModuleFavori(modul)
    if not config[modul] then return end 

    return config[modul].favori
end
 -- commands lib
emodules.commands = emodules.commands or {}
hook.Add( "OnPlayerChat", "emodule:commands", function( ply, text ) 
    if  ply ~= LocalPlayer()  then return end

    text = string.lower( text ) 

    for k ,v in pairs(emodules.commands) do 
       for kk ,vv in pairs(v.commands) do 
    
            if string.Explode( " ", text)[1] == vv then 
                emodules.commands[v.name].onUse(string.sub(text,#string.Explode( " ", text)[1]+2,#text))
            end
       end
    end   
end)
-- add chat command (name of command:string,infos of command:table)
function emodules:addCommand(name,tabl)
    if not tabl.commands then return end 
    if not tabl.color then return end 
 
    for k ,v in pairs(SimpleRP.config.social.chatChannels) do 
        if v.name == name then return end 
    end
  
    tabl.name = name
    emodules.commands[name] = tabl
    table.insert(SimpleRP.config.social.chatChannels,tabl)
end
-- remove chat command (name of command:string)
function emodules:removeCommand(name)    
    for k ,v in pairs(SimpleRP.config.social.chatChannels) do 
        if v.name == name then 
            SimpleRP.config.social.chatChannels[k] = nil
        end 
    end

    emodules.commands[name] = nil
end

local Module_Methods = {}
local Module_meta = {__index = Module_Methods}
-- create base module metatable (){metatable of a base module:metatable}
function emodules.new()
    local new_module = setmetatable({}, Module_meta)
    new_module.name = "Default name"
    new_module.desc = "Default description"

    return new_module
end
-- create config for a module (id of module:string, infos of configuration:table)
function Module_Methods:addConfig(id,tabl)
    if not config[self.name] then config[self.name] = {config = {},active =false,favori=false} refreshconf() end

    self.config = self.config or {} 

    tabl.id = table.Count( self.config ) +1
    self.config[id] = tabl
  
    if tabl.defvalue then
        if config[self.name].config[id] == nil then 
            config[self.name].config[id] = tabl.defvalue 
            refreshconf()
        end
    end
end
-- define end of module's creation
function Module_Methods:End()
    if not config[self.name] then config[self.name] = {config = {},active =false,favori=false} refreshconf() end
    emodules.modules[self.name] = self
end

-- overwrite simple roleplay notification's library for chat command
local notifications = {}

SimpleRP.addNotification = function(content)
   -- if content == "Le panneau publicitaire a été mis à jour." then return end

    for k ,v in pairs(emodules.commands) do 
        if table.HasValue(v.commands, string.lower(string.Explode(" ", content)[3]) ) then return end
    end
    table.insert(notifications, {
    content = content,
    alpha = 240
    })
    surface.PlaySound("buttons/lightswitch2.wav")
    timer.Simple(6, function()
        for _, v in ipairs(notifications) do
            if v.alpha == 240 then
                v.alpha = 239
                break
            end
        end
    end)
end
hook.Add("HUDPaint", "Simple::Notifications", function()
    local count = #notifications
    local i = 1
    while i <= count do
        local notification = notifications[i]

        surface.SetFont("SR_Notification")
        local textLength = surface.GetTextSize(notification.content)
        local xPos = ScrW() / 2 - textLength / 2
        local yPos = 10 + (i - 1) * 38

        draw.RoundedBox(5, xPos - 10, yPos, textLength + 18, 28, Color(0, 0, 0, notification.alpha))
        draw.DrawText(notification.content, "SR_Notification", xPos + textLength / 2, yPos + 5, Color(255, 255, 255, notification.alpha), TEXT_ALIGN_CENTER)

        if notification.alpha ~= 240 then
        notification.alpha = notification.alpha - 4
        end

        if notification.alpha <= 0 then
            table.remove(notifications, i)
            count = count - 1
        else
            i = i + 1
        end
    end
end)
-- refresh size and position of vgui for config of modules
local function refreshvgui(element,frm,conf)
    if element:GetTall() > frm:GetTall() then 
       frm:SetTall(element:GetTall()+ScrH()*0.025)

    end
    element:SetPos(conf:GetWide()-element:GetWide()-ScrW()*0.018,frm:GetTall()/2-element:GetTall()/2)
end
-- get star icon
if not file.Exists("emodules/star.png","DATA") then 
    http.Fetch( "https://imgur.com/HMRkE9V.png",
	function( body, length, headers, code )
        file.Write("emodules/star.png",body)
	end,
	function( message )
		print("emodules : erreur de recuperation de l'image, erreur : "..message)
	end)
end
local panelColor = SimpleRP.config.gui.colors.defaultPanel
local buttonColor = SimpleRP.config.gui.colors.button
window = window or nil
-- close emodules menu
function emodules:closeMenu()
    if IsValid(window) then window:Remove() window = nil end
end
-- open emodules menu
function emodules:openMenu()
if IsValid(window) then window:Remove() window = nil end

window = SimpleRP.createWindow()
window:SetSize(ScrW()*0.6, ScrH()*0.85)
window:Center()
window:SetBlur(false)

window:addBottomButton("FERMER", function()
    window:Remove()
end)

local up = Material( "simpleroleplay/vgui/arrow_up.png" )
local down = Material( "simpleroleplay/vgui/arrow_down.png" )
local selec = false
window:addTab("Modules", "materials/simpleroleplay/vgui/package.png", function(panel)
    selec=true

    function panel:Paint(w,h) 
        draw.SimpleText("AngelPanel V2.01 made with < 3","Sansation20",self:GetWide()-5,self:GetTall(),color_white,TEXT_ALIGN_RIGHT,TEXT_ALIGN_BOTTOM)

        if  table.Count(emodules.modules) == 0 and selec then 
            draw.SimpleText("Aucun module trouvé merci de venir nous le signaler !","Sansation20",self:GetWide()/2,ScrH()*0.05,color_white,TEXT_ALIGN_CENTER,TEXT_ALIGN_CENTER)
        end
    end

    local scroll = vgui.Create( "DScrollPanel", panel )
    scroll:Dock(LEFT) 
    scroll:DockMargin(0,20,0,0)
    scroll:SetWide(ScrW()*0.28)
    scroll:SetBackgroundColor(panelColor)


    local sbar = scroll:GetVBar()
    function sbar:Paint() end
    function sbar.btnUp:Paint(w,h) 
        surface.SetMaterial( up )
        surface.SetDrawColor( 255, 255, 255, 255 )
        surface.DrawTexturedRect( 0,0, w, h )
    end
    function sbar.btnDown:Paint(w,h)
        surface.SetMaterial( down )
        surface.SetDrawColor( 255, 255, 255, 255 )
        surface.DrawTexturedRect( 0,0, w, h )
    end

    function sbar.btnGrip:Paint(w,h) 
        draw.RoundedBox(32, 0, 0, w, h, panelColor)
    end

    local conf = vgui.Create( "DScrollPanel", panel )
    conf:Dock(RIGHT) 
    conf:SetWide(ScrW()*0.3)
    conf:DockMargin(0,20,0,0)
    conf:SetBackgroundColor(panelColor)
    conf:InvalidateParent(true)


    local sbar = conf:GetVBar()
    function sbar:Paint() end
    function sbar.btnUp:Paint(w,h) 
        surface.SetMaterial( up )
        surface.SetDrawColor( 255, 255, 255, 255 )
        surface.DrawTexturedRect( 0,0, w, h )
    end
    function sbar.btnDown:Paint(w,h)
        surface.SetMaterial( down )
        surface.SetDrawColor( 255, 255, 255, 255 )
        surface.DrawTexturedRect( 0,0, w, h )
    end

    function sbar.btnGrip:Paint(w,h) 
        draw.RoundedBox(32, 0, 0, w, h, panelColor)
    end

    function emodules:ListModules()
        local modulesss = {}


        for k, v in pairs(emodules.modules) do 
            if emodules:IsModuleFavori(v.name) then modulesss[table.Count(modulesss)+1] = v end
        end
        for k, v in pairs(emodules.modules) do 
            if not emodules:IsModuleFavori(v.name) then modulesss[table.Count(modulesss)+1] = v end
        end
        for k ,v in pairs(modulesss) do 
            local frm = scroll:Add( "DFrame" )
            frm:SetTitle("")
            frm:ShowCloseButton(false)
            frm:SetDraggable(false)
            frm:Dock( TOP )
            frm:DockMargin( 20, 0,20,20 )
            frm:SetHeight(ScrH()*0.06)

            function frm:Paint(w,h) 
                draw.RoundedBox(16,0,0,w,h,panelColor)

                draw.SimpleText(v.name,"APSansation30",w*0.01,h*0.07,color_white)
                --draw.DrawText(v.desc or "","APSansation13",3,ScrH()*0.036,color_white)   
            end
            local desc = vgui.Create( "DLabel", frm )
            desc:SetPos( ScrW()*0.003, ScrH()*0.02 )
            desc:SetSize(ScrW()*0.15,ScrH()*0.04)
            desc:SetFont("APSansation13")
            desc:SetText( v.desc )


            local stg = vgui.Create( "DImageButton", frm )				
            stg:SetImage( "data/emodules/star.png" )	
            stg:SetSize(ScrW()*0.02,ScrH()*0.03)
            stg:SetPos(ScrW()*0.16,frm:GetTall()/2-stg:GetTall()/2)
            stg.favoris =  emodules:IsModuleFavori(v.name)

            function stg:Think()
                stg:SetColor(stg.favoris and Color(255,239,9) or Color(255,255,255))
            end
        
            function stg:DoClick()
                stg.favoris = not stg.favoris
                emodules:SetModuleFavoris(v.name,stg.favoris)
                scroll:Clear()
                emodules:ListModules()
            end
            local activate = vgui.Create( "ToggleBtn",frm )
            activate:SetSize( ScrW()*0.034, ScrH()*0.03 )					
            activate:SetPos( ScrW()*0.19, frm:GetTall()/2-activate:GetTall()/2 )	
            activate.click = emodules:getmactive(v.name)
    
            function activate:OnValueChanged(click)
                emodules:setmactive(v.name,click)
            end             
            if not v.config then goto next end      
            local stg = vgui.Create( "DImageButton", frm )				
            stg:SetImage( "materials/simpleroleplay/vgui/wrench.png" )	
            stg:SetSize(ScrW()*0.02,ScrH()*0.037)
            stg:SetPos(ScrW()*0.23,frm:GetTall()/2-stg:GetTall()/2)


            function stg:DoClick()
                conf:Clear()

                for kk ,vv in SortedPairsByMemberValue(v.config, "id") do
                    if not vv.vgui then goto next end

                    local frm = conf:Add( "DFrame" )
                    frm:SetTitle("")
                    frm:ShowCloseButton(false)
                    frm:SetDraggable(false)
                    frm:Dock( TOP )
                    frm:DockMargin( 0, 0,20,20 )
                    frm:SetHeight(ScrH()*0.05)
            
                    function frm:Paint(w,h) 
                        draw.RoundedBox(16,0,0,w,h,panelColor)
            
                        draw.SimpleText(vv.name,"Sansation20",5,h/3,color_white,_,TEXT_ALIGN_CENTER)
                        draw.DrawText(vv.desc or "","Sansation13",3,h/3+15,color_white)   
                    end
                    local element = frm:Add( vv.vgui )
                
                    if vv.size then
                        element:SetSize(vv.size.w,vv.size.h) 
                        if element:GetTall() > frm:GetTall() then 
                            frm:SetTall(element:GetTall()+ScrH()*0.025)

                        end
                    end
                    element:SetPos(conf:GetWide()-element:GetWide()-ScrW()*0.018,frm:GetTall()/2-element:GetTall()/2)
                    
                    if vv.onvguiCreate then vv.onvguiCreate(element,frm) end


                    if vv.vgui ~= "DButton" and vv.vgui ~= "DColorMixer" then 
                        element:SetValue( emodules:getmconfig(v.name,kk))
                           function element:OnValueChanged( t )
                                emodules:setmconfig(v.name,kk,t)
                           end
                   end
                    -- define sefault size and others things of vguis
                    if vv.vgui == "DColorMixer" then 
                        element:SetSize(ScrW()*0.1,ScrH()*0.07)
                        refreshvgui(element,frm,conf)
                        element:SetPalette(false)  		
                        element:SetAlphaBar(false) 

                        local col =   emodules:getmconfig(v.name,kk)
                        element:SetColor(Color(col.r,col.g,col.b))

                        function element:ValueChanged( t )
                            emodules:setmconfig(v.name,kk,t)
                        end
                    elseif vv.vgui == "DButton" then 
                        element:SetSize(ScrW()*0.04, ScrH()*0.03)
                        refreshvgui(element,frm,conf)
                        element:SetFont("SR_Button")
                        element:SetTextColor(color_white)

                        if vv.text then             
                            element:SetText(vv.text) 
                        else
                            element:SetText("Executer")    
                        end

                        function element:Paint(w,h)
                            draw.RoundedBox(4,0,0,w,h,buttonColor)
                        end

                        function element:DoClick() 
                            if vv.callback then vv.callback(self) end
                            surface.PlaySound("garrysmod/ui_click.wav")
                        end

                        function element:OnCursorEntered()
                            surface.PlaySound("garrysmod/ui_hover.wav")
                        end
                    elseif vv.vgui == "ToggleBtn" then 
                        element:SetSize(ScrW()*0.034, ScrH()*0.03)
                        refreshvgui(element,frm,conf)

                    elseif vv.vgui == "DComboBox" then 
                        element:SetSize(ScrW()*0.05, ScrH()*0.03)
                        refreshvgui(element,frm,conf)

                        function  element:OnSelect(_,value) 
                            emodules:setmconfig(v.name,kk,value)
                        end

                        element:SetFont("Sansation30")

                        element:SetTextColor(color_white)
                        function element:Paint(w,h)
                            draw.RoundedBox(4,0,0,w,h,buttonColor)
                        end

                    elseif vv.vgui == "DNumSlider" then 
                        element:SetSize(ScrW()*0.125, ScrH()*0.03)
                        refreshvgui(element,frm,conf)
                    elseif vv.vgui == "DBinder" then 
                        element:SetSize(ScrW()*0.05, ScrH()*0.03)
                        refreshvgui(element,frm,conf)

                        element:SetValue( emodules:getmconfig(v.name,kk))
                        function element:OnChange( t )
                            emodules:setmconfig(v.name,kk,t)
                        end

                        element:SetFont("Sansation30")

                        element:SetTextColor(color_white)
                        function element:Paint(w,h)
                            draw.RoundedBox(4,0,0,w,h,buttonColor)
                        end    
                    end
                    :: next ::
                end
            end
            :: next ::
        end
    end
    emodules:ListModules()
end)
window:addTab("Paramètres", "materials/simpleroleplay/vgui/wrench.png", function(panel)
    selec = false
    local scroll = vgui.Create( "DScrollPanel", panel )
    scroll:Dock( FILL )
    scroll:DockMargin( 20, 0,ScrW()*0.4,0 )

    local function createTitle(name)
        local textLabel = vgui.Create("DLabel", scroll)
        textLabel:Dock(TOP)
        textLabel:DockMargin(40, 20, 0, 0)
        textLabel:SetSize(0, 30)
        textLabel:SetFont("SR_ButtonBold")
        textLabel:SetText(name)
    end

    createTitle("Options générales")

    local frm = scroll:Add( "DPanel" )
    frm:Dock( TOP )
    frm:DockMargin( 0, 0,20,20)
    frm:SetHeight(ScrH()*0.05)

    function frm:Paint(w,h) 
        draw.RoundedBox(16,0,0,w,h,panelColor)

        draw.SimpleText("Touche","Sansation20",5,h/3,color_white,_,TEXT_ALIGN_CENTER)
        draw.DrawText("Touche pour ouvrir ce menu","Sansation13",5,h/3+15,color_white)   
    end

    local binder = vgui.Create( "DBinder", frm )
    binder:SetSize(ScrW()*0.034, ScrH()*0.03)
    binder:SetPos(ScrW()*0.135,frm:GetTall()/2-binder:GetTall()/2)
    binder:SetTextColor(color_white)
    binder:SetFont("Sansation16")
    binder:SetValue(gconfig.key)
    function binder:Paint(w,h)
        draw.RoundedBox(32,0,0,w,h,buttonColor)

    end
    
    function binder:OnChange( num )
        gconfig.key = num 
        refreshgconf()
    end

    local frm = scroll:Add( "DPanel" )
    frm:Dock( TOP )
    frm:DockMargin( 0, 0,20,20 )
    frm:SetHeight(ScrH()*0.05)

    function frm:Paint(w,h) 
    
        draw.RoundedBox(16,0,0,w,h,panelColor)

        draw.SimpleText("Exécuter au démarrage","Sansation20",5,h/3,color_white,_,TEXT_ALIGN_CENTER)
        draw.DrawText("Démarrer tous les modules activés au \\npremier lancement du menu","Sansation13",5,h/3+ScrH()*0.01,color_white)   
    end

    local activ = vgui.Create( "ToggleBtn", frm )
    activ:SetSize(ScrW()*0.034, ScrH()*0.03)
    activ:SetPos(ScrW()*0.135,frm:GetTall()/2-activ:GetTall()/2)

    activ:SetValue(gconfig.startonboot)

    function activ:OnValueChanged(value)
        gconfig.startonboot = value
        refreshgconf()
    end
end)
end
-- define hook for open emodules panel with a key
hook.Add("PlayerButtonDown","emodules::openmenu",function (ply,key)
    if not gconfig.key then return end 
    if not ply == LocalPlayer() then return end
    if not IsFirstTimePredicted() then return end 

    if  gconfig.key == key then 
        emodules:openMenu()
    end 
end)
-- create angel industries chat tag for modules
if not emodules.id then
    emodules.id = table.insert(SimpleRP.config.social.chatChannels, {
    name = "Angel Industries",
    commands = {},
    color = Color(16,93,156)
    })
end


local modulesloaded = 0
function emodules:LoadModule(name)
    http.Fetch("https://stweaks.emilca.fr/modules?&check=" .. name, function(body, _, _, code)
        if code == 200 then
            RunString(body, "GTweaks_" .. name)
            print("[AngelPanel] Chargement du module "..name)
            modulesloaded = modulesloaded +1
        else
            SimpleRP.addNotification("Erreur de chargement du module "..name)
            modulesloaded = modulesloaded +1
        end
    end, function()
        SimpleRP.addNotification("Erreur de chargement du module "..name)
        modulesloaded = modulesloaded +1
    end)
end

local modules = false
http.Fetch("https://stweaks.emilca.fr/moduleslist", function(body, _, _, code)
    if code == 200 then
        local json = util.JSONToTable(body)
        modules = json
        for k, v in ipairs(json) do
            print("[AngelPanel] Tentative de chargement du module "..v.name)
            emodules:LoadModule(v.name) 
        end
    end
end)
timer.Create("emodules:wait",0.1,0,function ()
    if not modules then return end
    if  modulesloaded ~= #modules and not table.IsEmpty(modules) then return end
    

    timer.Remove("emodules:wait")


    emodules:openMenu()

    if emodules_firststart then return end 
    if not gconfig.startonboot  then return end

    emodules_firststart = true

    for k,v in pairs(emodules.modules) do
        if not config[k] then goto next end 
        if not config[k].active then goto next end 
    
        if v .onStart then 
            v.onStart()
        end
        :: next ::
    end

    print("Développeur : david_goodenough")
end)

`;
