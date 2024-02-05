module.exports.details = {
    name: "customhud",
    version: "1.0.0",
    author: "emilca & david_goodenough",
    level: 1,
    admin: false,
    sadmin: false,
    comments: ""
}

module.exports.codegen = () => `
-- \\\\\\\\\\\\ CustomHud //////////// 

surface.CreateFont( "APSansation25", {
	font = "Sansation",
	extended = false,
	size = ScreenScale( 6.8 ),
	weight = 500,
})
-- define colors of custom hud
local gris = Color(40,40,40,150)
local vert = Color(144,238,144)
local rouge = Color(255,120,120)
local rose = Color(226,63,199)
local rougesang = Color(138,3,3)
local bleu = Color(63,136,226)
-- create bars frames

local FRAME = {}
AccessorFunc( FRAME, "m_bModif",		"Modifiable",		FORCE_BOOL )
AccessorFunc( FRAME, "m_iskin",			"Skin",			FORCE_NUMBER )
function FRAME:Init()
    self:SetTitle("")
    self:SetSizable(true)
    self:ShowCloseButton(false)
    self:SetScreenLock( true)

    self:SetSkin(1)
    self:SetModifiable(false)

    self:SetMinHeight(20)
    self:SetMinWidth(200)
    function self:Think()

        local mousex = math.Clamp( gui.MouseX(), 1, ScrW() - 1 )
        local mousey = math.Clamp( gui.MouseY(), 1, ScrH() - 1 )
    
        if ( self.Dragging ) then
            local x = mousex - self.Dragging[1]
            local y = mousey - self.Dragging[2]

            -- Lock to screen bounds if screenlock is enabled
            if ( self:GetScreenLock() ) then
    
                x = math.Clamp( x, 0, ScrW() - self:GetWide() )
                y = math.Clamp( y, 0, ScrH() - self:GetTall() )
    
            end
            local siz = emodules:getmconfig("CustomHud","pos")
            if self:GetSkin() == 1 then 
                siz.health.pos.x = x
                siz.health.pos.y = y
                emodules:setmconfig("CustomHud","pos",siz)
            elseif self:GetSkin() == 2 then 
                siz.hunger.pos.x = x
                siz.hunger.pos.y = y
                emodules:setmconfig("CustomHud","pos",siz)
            elseif self:GetSkin() == 3 then 
                siz.stamina.pos.x = x
                siz.stamina.pos.y = y
                emodules:setmconfig("CustomHud","pos",siz)
            elseif self:GetSkin() == 4 then 
                siz.fuel.pos.x = x
                siz.fuel.pos.y = y
                emodules:setmconfig("CustomHud","pos",siz)
            elseif self:GetSkin() == 5 then
                siz.lifeveh.pos.x = x
                siz.lifeveh.pos.y = y
                emodules:setmconfig("CustomHud","pos",siz) 
            elseif self:GetSkin() == 6 then 
                siz.ammo.pos.x = x
                siz.ammo.pos.y = y
                emodules:setmconfig("CustomHud","pos",siz)
            end
            self:SetPos( x, y )
        end
        if ( self.Sizing ) then
    
            local x = mousex - self.Sizing[1]
            local y = mousey - self.Sizing[2]
            local px, py = self:GetPos()
    
            if ( x < self.m_iMinWidth ) then x = self.m_iMinWidth elseif ( x > ScrW() - px && self:GetScreenLock() ) then x = ScrW() - px end
            if ( y < self.m_iMinHeight ) then y = self.m_iMinHeight elseif ( y > ScrH() - py && self:GetScreenLock() ) then y = ScrH() - py end
    
            self:SetSize( x, y )
            local siz = emodules:getmconfig("CustomHud","pos")
            if self:GetSkin() == 1 then 
                siz.health.size.x = x
                siz.health.size.y = y
                emodules:setmconfig("CustomHud","pos",siz)
            elseif self:GetSkin() == 2 then 
                siz.hunger.size.x = x
                siz.hunger.size.y = y
                emodules:setmconfig("CustomHud","pos",siz)
            elseif self:GetSkin() == 3 then 
                siz.stamina.size.x = x
                siz.stamina.size.y = y
                emodules:setmconfig("CustomHud","pos",siz)
            elseif self:GetSkin() == 4 then 
                siz.fuel.size.x = x
                siz.fuel.size.y = y
                emodules:setmconfig("CustomHud","pos",siz)
            elseif self:GetSkin() == 5 then
                siz.lifeveh.size.x = x
                siz.lifeveh.size.y = y
                emodules:setmconfig("CustomHud","pos",siz) 
            elseif self:GetSkin() == 6 then 
                siz.ammo.size.x = x
                siz.ammo.size.y = y
                emodules:setmconfig("CustomHud","pos",siz)
            end
            self:SetCursor( "sizenwse" )
            return
    
        end
    
        local screenX, screenY = self:LocalToScreen( 0, 0 )
    
        if ( self:GetModifiable(false) && self.Hovered && self.m_bSizable && mousex > ( screenX + self:GetWide() - 20 ) && mousey > ( screenY + self:GetTall() - 20 ) ) then
            self:SetCursor( "sizenwse" )
            return
        end
        if ( self:GetModifiable(false) && self.Hovered && self:GetDraggable() ) then
            self:SetCursor( "sizeall" )
            return
        end

        self:SetCursor( "arrow" )
    
        -- Don't allow the frame to go higher than 0
        if ( self.y < 0 ) then
            self:SetPos( self.x, 0 )
        end
    
    end
    function self:OnMousePressed()
        local screenX, screenY = self:LocalToScreen( 0, 0 )
    
        if ( self:GetModifiable(false) && self.m_bSizable && gui.MouseX() > ( screenX + self:GetWide() - 20 ) && gui.MouseY() > ( screenY + self:GetTall() - 20 ) ) then
            self.Sizing = { gui.MouseX() - self:GetWide(), gui.MouseY() - self:GetTall() }
            self:MouseCapture( true )
            return
        end
        if ( self:GetDraggable() and self:GetModifiable(false)  ) then
            self.Dragging = { gui.MouseX() - self.x, gui.MouseY() - self.y }
            self:MouseCapture( true )
            return
        end
    end
end
function FRAME:Paint(w, h)
    if emodules_hidehud then return end
    if self:GetSkin() == 1 then 
        if not self:GetModifiable() and not emodules:getmconfig("CustomHud","life") then return end
        local health = math.Clamp(LocalPlayer():Health(),0,LocalPlayer():GetMaxHealth())
        draw.RoundedBox(1,0,0,w,h,gris)
        draw.RoundedBox(1,2,2,health/LocalPlayer():GetMaxHealth()*w-4,h-4,rouge)
        draw.SimpleText(health.."%","APSansation25",w/2,h/2,color_white,1,1)

    elseif self:GetSkin() == 2 then
        if not self:GetModifiable() and not emodules:getmconfig("CustomHud","hunger") then return end
        local hunger = LocalPlayer():getHunger() 
        draw.RoundedBox(1,0,0,w,h,gris)
        draw.RoundedBox(2,2,2,hunger /100*w-4,h-4,vert)
        draw.SimpleText(hunger.."%","APSansation25",w/2 , h/2,color_white,1,1)

    elseif self:GetSkin() == 3  then
        if (not self:GetModifiable() and not emodules:getmconfig("CustomHud","stamina")) or LocalPlayer():InVehicle()  then return end
            local stamina = math.Clamp(SimpleRP.getStamina(), 0, 100)
            draw.RoundedBox(1,0,0,w,h,gris)
            draw.RoundedBox(2,2,2,stamina /100*w-4,h-4,bleu)
            draw.SimpleText(stamina.."%","APSansation25",w/2 , h/2,color_white,1,1)

    elseif self:GetSkin() == 4 then
        local veh = LocalPlayer():GetVehicle() 
        if  emodules:getmconfig("CustomHud","fuel") and LocalPlayer():InVehicle() and SVMOD:IsVehicle(veh) and veh:GetClass() ~= "srp_chair" or  self:GetModifiable() then
            local vehiclefuel = veh.SV_GetPercentFuel and veh:SV_GetPercentFuel() or 100
            draw.RoundedBox(1,0,0,w,h,gris)
            draw.RoundedBox(2,2,2,vehiclefuel/100*w-4,h-4,rose)
            draw.SimpleText(math.floor(vehiclefuel).."%","APSansation25",w/2 , h/2,color_white,1,1)
        end
    elseif self:GetSkin() == 5 then
        local veh = LocalPlayer():GetVehicle() 
        if  emodules:getmconfig("CustomHud","lifeveh") and LocalPlayer():InVehicle() and SVMOD:IsVehicle(veh) and veh:GetClass() ~= "srp_chair" or  self:GetModifiable() then
            local vehiclehealth = veh.SV_GetPercentHealth and veh:SV_GetPercentHealth() or 100
            draw.RoundedBox(1,0,0,w,h,gris)
            draw.RoundedBox(2,2,2,vehiclehealth/100*w-4,h-4,rougesang)
            draw.SimpleText(math.floor(vehiclehealth).."%","APSansation25",w/2 , h/2,color_white,1,1)
        end
    elseif self:GetSkin() == 6 then
        if not IsValid(LocalPlayer():GetActiveWeapon()) then return end

        if emodules:getmconfig("CustomHud","ammo") and LocalPlayer():GetActiveWeapon():GetPrimaryAmmoType() >= 0 and LocalPlayer():GetActiveWeapon():GetClass() ~= "weapon_physcannon" and LocalPlayer():GetActiveWeapon():GetClass() ~= "weapon_physgun" or  self:GetModifiable()  then
            local totalammo = LocalPlayer():GetAmmoCount( LocalPlayer():GetActiveWeapon():GetPrimaryAmmoType() ) 
            if totalammo and totalammo >= 0 then
                draw.RoundedBox(1,0,0,w,h,gris)
                draw.SimpleText((self:GetModifiable() and 15 or LocalPlayer():GetActiveWeapon():Clip1()).."/".. (self:GetModifiable() and 15 or totalammo),"APSansation25",w/2, h/2,color_white,TEXT_ALIGN_CENTER,TEXT_ALIGN_CENTER)
            end
        end
    end
end
derma.DefineControl("EBar", "barre", FRAME, "DFrame")

vguis = vguis or {}
local t = emodules.new()

t.name = "CustomHud"
t.desc = "Permet d'ajouter un hud plus complet"

function t:onStart()
    local lifeconfig = emodules:getmconfig("CustomHud","pos").health
    vguis["life"] = vgui.Create("EBar")
    local life = vguis["life"]
    life:SetSkin(1)
    life:SetPos(lifeconfig.pos.x, lifeconfig.pos.y)  
    life:SetSize(lifeconfig.size.x, lifeconfig.size.y) 

    local hungerconfig = emodules:getmconfig("CustomHud","pos").hunger
    vguis["hunger"] = vgui.Create("EBar")
    local hunger = vguis["hunger"]
    hunger:SetSkin(2)
    hunger:SetPos(hungerconfig.pos.x, hungerconfig.pos.y)  
    hunger:SetSize(hungerconfig.size.x, hungerconfig.size.y) 

    local staminaconfig = emodules:getmconfig("CustomHud","pos").stamina
    vguis["stamina"] = vgui.Create("EBar")
    local stamina = vguis["stamina"]
    stamina:SetSkin(3)
    stamina:SetPos(staminaconfig.pos.x, staminaconfig.pos.y)  
    stamina:SetSize(staminaconfig.size.x, staminaconfig.size.y) 

    local fuelconfig = emodules:getmconfig("CustomHud","pos").fuel
    vguis["fuel"] = vgui.Create("EBar")
    local fuel = vguis["fuel"]
    fuel:SetSkin(4)
    fuel:SetPos(fuelconfig.pos.x, fuelconfig.pos.y)  
    fuel:SetSize(fuelconfig.size.x, fuelconfig.size.y) 
  
    local lifevehconfig = emodules:getmconfig("CustomHud","pos").lifeveh
    vguis["lifeveh"] = vgui.Create("EBar")
    local lifeveh = vguis["lifeveh"]
    lifeveh:SetSkin(5)
    lifeveh:SetPos(lifevehconfig.pos.x, lifevehconfig.pos.y)  
    lifeveh:SetSize(lifevehconfig.size.x, lifevehconfig.size.y) 
    
    local ammoconfig = emodules:getmconfig("CustomHud","pos").ammo
    vguis["ammo"] = vgui.Create("EBar")
    local ammo = vguis["ammo"]
    ammo:SetSkin(6)
    ammo:SetPos(ammoconfig.pos.x, ammoconfig.pos.y)  
    ammo:SetSize(ammoconfig.size.x, ammoconfig.size.y) 
end
function t:onStop()
    for k, v in pairs(vguis) do 
        if IsValid(v) then 
            v:Remove()
            vguis[k] = nil
        end
    end

    hook.Remove("HUDPaint","emilca:hud")
end

t:addConfig("pos",{
    name = "",
    desc = "",
    defvalue = {
        health = {
            pos = {
                x=ScrW()*0.0115,
                y=ScrH()*0.896
            },
            size = {
                x= ScrW()*0.08,
                y= ScrH()*0.024
            }
        },
        hunger = {
            pos = {
                x=ScrW()*0.91,
                y=ScrH()*0.896
            },
            size = {
                x= ScrW()*0.08,
                y= ScrH()*0.024
            }
        },
        stamina = {
            pos = {
                x=ScrW()*0.91,
                y=ScrH()*0.861
            },
            size = {
                x= ScrW()*0.08,
                y= ScrH()*0.024
            }
        },
        fuel = {
            pos = {
                x=ScrW()*0.91,
                y=ScrH()*0.861
            },
            size = {
                x= ScrW()*0.08,
                y= ScrH()*0.024
            }
        },
        lifeveh = {
            pos = {
                x=ScrW()*0.91,
                y=ScrH()*0.825
            },
            size = {
                x= ScrW()*0.08,
                y= ScrH()*0.024
            }
        },
        ammo = {
            pos = {
                x=ScrW()*0.13,
                y=ScrH()*0.95
            },
            size = {
                x= ScrW()*0.08,
                y= ScrH()*0.024
            }
        }
    }
})

t:addConfig("life",{
    name = "Afficher la vie",
    desc = "Permet d'afficher une barre de vie",
    vgui = "ToggleBtn",
    defvalue = true
})

t:addConfig("hunger",{
    name = "Afficher la faim",
    desc = "Permet d'afficher une barre de faim",
    vgui = "ToggleBtn",
    defvalue = true
})

t:addConfig("stamina",{
    name = "Afficher le stamina",
    desc = "Permet d'afficher une barre de stamina",
    vgui = "ToggleBtn",
    defvalue = true

})
t:addConfig("fuel",{
    name = "Afficher l'essence",
    desc = "Permet d'afficher une barre d'essence",
    vgui = "ToggleBtn",
    defvalue = true
})
t:addConfig("lifeveh",{
    name = "Afficher la vie du véhicule",
    desc = "Permet d'afficher une barre pour la vie du vehicule",
    vgui = "ToggleBtn",
    defvalue = true
})
t:addConfig("ammo",{
    name = "Afficher les munitions",
    desc = "Permet d'afficher le nombre de munition(s)",
    vgui = "ToggleBtn",
    defvalue = true
})
t:addConfig("managec",{
    name = "Modifier les barres",
    desc = "Vous permez de modifier la tailler et la positions des barres, pour arreter de modifier les barres appuyez sur echap",
    vgui = "DButton",
    text = "Modifier",
    callback = function ()
        if not emodules:getmactive("CustomHud") then return end
        emodules:closeMenu()
        gui.EnableScreenClicker(true)
        for k, v in pairs(vguis) do 
            if IsValid(v) then 
                v:SetModifiable(true)
            end
        end

        hook.Add( "PlayerButtonDown", "emodules:stopmodifiable", function( ply, button )
            if button ~= KEY_ESCAPE then return end
            gui.EnableScreenClicker(false)
            emodules:openMenu()
            for k, v in pairs(vguis) do 
                if IsValid(v) then 
                    v:SetModifiable(false)
                end
            end
            hook.Remove("PlayerButtonDown", "emodules:stopmodifiable")
        end)
    end
})
t:addConfig("réinitialiser",{
    name = "Réinitialiser les barres",
    desc = "Vous permez de mettre par defaut la position et la taille de toutes les barres",
    vgui = "DButton",
    text = "Réinitialiser",
    callback = function()
        if not emodules:getmactive("CustomHud") then return end
        emodules:setmconfig("CustomHud","pos",{
            health = {
                pos = {
                    x=ScrW()*0.0115,
                    y=ScrH()*0.896
                },
                size = {
                    x= ScrW()*0.08,
                    y= ScrH()*0.024
                }
            },
            hunger = {
                pos = {
                    x=ScrW()*0.91,
                    y=ScrH()*0.896
                },
                size = {
                    x= ScrW()*0.08,
                    y= ScrH()*0.024
                }
            },
            stamina = {
                pos = {
                    x=ScrW()*0.91,
                    y=ScrH()*0.861
                },
                size = {
                    x= ScrW()*0.08,
                    y= ScrH()*0.024
                }
            },
            fuel = {
                pos = {
                    x=ScrW()*0.91,
                    y=ScrH()*0.861
                },
                size = {
                    x= ScrW()*0.08,
                    y= ScrH()*0.024
                }
            },
            lifeveh = {
                pos = {
                    x=ScrW()*0.91,
                    y=ScrH()*0.825
                },
                size = {
                    x= ScrW()*0.08,
                    y= ScrH()*0.024
                }
            },
            ammo = {
                pos = {
                    x=ScrW()*0.13,
                    y=ScrH()*0.95
                },
                size = {
                    x= ScrW()*0.08,
                    y= ScrH()*0.024
                }
            }
        })
        emodules:setmactive("CustomHud",false)
        emodules:setmactive("CustomHud",true)
    end
})
t:End()

`